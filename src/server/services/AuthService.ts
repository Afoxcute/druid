import { BaseService } from "~/server/services/BaseService";
import bcrypt from "bcrypt";
import { env } from "~/env";

export class AuthService extends BaseService {
  private get saltRounds() {
    return parseInt(env.SALT_ROUNDS, 10);
  }

  /**
   * Hash the password
   * @param plainPassword
   * @private
   */
  private async toHash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  /**
   * Validate the pin for the user
   * @param userId
   * @param pin
   */
  async validatePin(
    userId: number,
    pin: string,
  ): Promise<{ success: boolean }> {
    try {
      // Save user to the database
      const user = await this.db.user.findUniqueOrThrow({
        where: { id: userId },
        select: { hashedPin: true },
      });
      if (!user.hashedPin) {
        throw new Error("User does not have a pin");
      }
      const isValid = await bcrypt.compare(pin, user.hashedPin);
      return { success: isValid };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  }

  /**
   * Set the pin for the user
   * @param userId
   * @param pin
   */
  async setPin(userId: number, pin: string): Promise<{ success: boolean; error?: string }> {
    try {
      const hashedPin = await this.toHash(pin);

      // First check if user exists
      const user = await this.db.user.findUnique({
        where: { id: userId },
        select: { hashedPin: true },
      });

      if (!user) {
        console.error("User not found:", userId);
        return { success: false, error: "User not found" };
      }

      // Check if user already has a PIN
      if (user.hashedPin !== null) {
        console.error("User already has a PIN set:", userId);
        return { success: false, error: "User already has a PIN set" };
      }

      // Update user with new PIN
      await this.db.user.update({
        where: { id: userId },
        data: { hashedPin },
      });
      console.log("Successfully set PIN for user:", userId);

      return { success: true };
    } catch (e) {
      console.error("Error setting PIN:", e);
      return { success: false, error: e instanceof Error ? e.message : "Failed to set PIN" };
    }
  }
}
