import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import * as process from 'node:process';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    this.logger.error(
      `Request failed: ${request.method} ${request.url} (${exception})`,
    );

    if (process.env.NODE_ENV !== 'test') {
      const botToken = process.env.BOT_TOKEN;
      const chatId = process.env.CHAT_ID;
      const errorMessage =
        `⚠️ Error on ${request.method} ${request.url}\n` +
        `${exception.name}: ${exception.message}\n` +
        `${new Date().toISOString()}`;

      try {
        await axios.post(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            chat_id: chatId,
            text: errorMessage,
            parse_mode: 'Markdown',
          },
        );
      } catch (err) {
        this.logger.error('Failed to send Telegram alert:', err);
      }
    }

    return response.render('error');
  }
}
