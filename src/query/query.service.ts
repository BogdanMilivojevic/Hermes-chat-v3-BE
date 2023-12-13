import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryService {
  userSearch(value: string, id: number) {
    return `SELECT * FROM "Users" WHERE "username" ILIKE '%${value}%' AND id !=${id}`;
  }

  receiverUsers(id: string) {
    return `SELECT ur.receiver_user_id
     FROM "Users" u
     JOIN "UserRelationships" ur ON u.id = ur.sender_user_id 
     WHERE u.id = ${id}`;
  }

  senderUsers(id: string) {
    return `SELECT ur.sender_user_id
    FROM "Users" u
    JOIN "UserRelationships" ur ON u.id = ur.receiver_user_Id 
    WHERE u.id = ${id}`;
  }

  getConversation(id: string, limit: number) {
    return `SELECT "Messages".id, user_id,"text","Messages"."createdAt","Messages"."updatedAt",url FROM "Conversations"
    JOIN "Messages" ON "Conversations".id = "Messages".conversation_id
    LEFT JOIN "Files" ON "Messages".id = "Files".attachable_id
    WHERE "Conversations".id = ${id}
    ORDER BY "Messages"."createdAt" DESC
    LIMIT ${limit}
    `;
  }

  findConversation(usersIds) {
    return `SELECT conversation_Id
    FROM "ConversationUsers"
    WHERE user_id IN (${usersIds.join()})
    GROUP BY conversation_id
    HAVING COUNT(DISTINCT user_id) = 2;`;
  }
}
