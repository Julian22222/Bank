import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PoolClient, Pool } from 'pg';
import { PG_POOL } from '../database/database.module';

@Injectable()
export class MessagesService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findAll() {
    try {
      const result = await this.pool.query(`SELECT * FROM messages`);

      if (!result.rows.length) {
        throw new NotFoundException('Messages not found');
      }

      return result.rows;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  }

  async findAllUserMessages(userId: number) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM messages WHERE customer_id = $1`,
        [userId],
      );

      return result.rows;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async findOne(messageId: number) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM messages WHERE message_id = $1`,
        [messageId],
      );

      if (!result.rows.length) {
        throw new NotFoundException('Message not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  }

  async create(createMessageDto: CreateMessageDto, client?: PoolClient) {
    const executor = client ?? this.pool;

    const { customer_id, msg_subject, msg_status, msg_body, msg_created_by } =
      createMessageDto;

    try {
      const result = await executor.query(
        `
        INSERT INTO messages (customer_id, msg_subject, msg_status, msg_body, msg_created_by) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
        [customer_id, msg_subject, msg_status, msg_body, msg_created_by],
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error sending message to user:', error);
      throw error;
    }
  }

  async update(messageId: number, updateMessageDto: UpdateMessageDto) {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(updateMessageDto)) {
      if (value !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new BadRequestException('No fields to update');
    }

    values.push(messageId);

    const query = `
    UPDATE messages
    SET ${fields.join(', ')}
    WHERE message_id = $${index}
    RETURNING *
  `;

    try {
      const result = await this.pool.query(query, values);

      if (!result.rows.length) {
        throw new NotFoundException('Error, Message not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }

  async remove(messageId: number) {
    try {
      const result = await this.pool.query(
        `DELETE FROM messages WHERE message_id = $1 RETURNING *`,
        [messageId],
      );

      if (!result.rowCount) {
        throw new NotFoundException('Message not found');
      }
      return { message: 'Message deleted successfully' };
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  async removeAllUsersMessages(id: number, client?: PoolClient) {
    const executor = client ?? this.pool;
    try {
      const result = await executor.query(
        `DELETE FROM messages WHERE customer_id = $1 RETURNING *`,
        [id],
      );

      if (!result.rowCount) {
        throw new NotFoundException('Messages not found');
      }
      return { message: 'All messages deleted successfully for this user' };
    } catch (error) {
      console.error('Error deleting messages:', error);
      throw error;
    }
  }
}
