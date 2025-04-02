import { BaseService } from "~/server/services/BaseService";
import bcrypt from "bcryptjs";
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
  async setPin(userId: number, pin: string): Promise<{ success: boolean }> {
    try {
      const hashedPin = await this.toHash(pin);

      // Check if user already has a pin
      const userWithPin = await this.db.user.count({
        where: {
          id: userId,
          hashedPin: {
            not: { equals: null },
          },
        },
      });
      
      console.log("userWithPin count:", userWithPin);
      
      if (userWithPin !== 0) {
        console.log("User already has a pin");
        return { success: false };
      }
      
      // Update user with hashed pin
      await this.db.user.update({
        where: { id: userId },
        data: { hashedPin },
      });
      
      console.log("Pin set successfully for user", userId);
      return { success: true };
    } catch (e) {
      console.error("Error setting pin:", e);
      return { success: false };
    }
  }
}
