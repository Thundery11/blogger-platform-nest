import nodemailer from 'nodemailer';
export const emailAdapter = {
  async sendEmail(email: string, message: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nizovtsovillia@gmail.com',
        pass: 'fhtc eten opez paig',
      },
    });

    const info = await transporter.sendMail({
      from: 'Illia <nizovtsovillia@gmail.com>', // sender address
      to: email, // list of receivers // Subject line
      html: message,
    });

    return info;
  },
};
