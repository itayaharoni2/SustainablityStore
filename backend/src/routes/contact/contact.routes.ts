import { ContactSchema } from "../../schemas";
import { Router } from "express";
import { Resend } from "resend";
import rateLimiter from "../../middleware/rate-limiter";

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY ?? "sk_test_123"); // to avoid error, I added "?? 'sk_test_123'"

router.post(
  "/",
  rateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 5 }),
  async (req, res) => {
    try {
      const values = req.body;

      const validatedFields = ContactSchema.safeParse(values);

      if (!validatedFields.success) {
        return res.json({
          error: "Invalid fields",
          success: false,
        }).status(400);
      }

      const { name, email, message } = validatedFields.data;

      const { data, error } = await resend.emails.send({
        from: "The Sustainable Lifestyle <onboarding@resend.dev>",
        to: [process.env.RESEND_RECEIVER_EMAIL!],
        subject: `${name} has contacted you`,
        html: `<p>${message} \n \n Sender email: ${email}</p>`,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          error,
        });
      }

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return res
        .json({
          error: "Something went wrong",
          success: false,
        })
        .status(500);
    }
  }
);

export default router;
