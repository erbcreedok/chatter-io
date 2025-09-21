import type { ParsedChat, ChatCollection, MediaCollection } from '../types';
import { WhatsAppParser } from './whatsappParser';

interface ProcessedChatData {
  processedAt: string;
  totalChats: number;
  chats: {
    name: string;
    content: string;
    mediaFiles: MediaCollection | string[];
    source: string;
  }[];
}

export class ChatFileReader {
  static async loadAllChats(): Promise<ChatCollection> {
    const chats: ParsedChat[] = [];
    
    try {
      // Try to load processed chat data
      const processedData = await this.loadProcessedChats();
      
      if (processedData && processedData.chats.length > 0) {
        // Use processed data
        processedData.chats.forEach(chatData => {
          const parsedChat = WhatsAppParser.parseChat(
            chatData.content, 
            chatData.name, 
            chatData.mediaFiles
          );
          chats.push(parsedChat);
        });
        
        console.log(`✅ Loaded ${chats.length} chats from processed data`);
      } else {
        // Fallback to sample data
        const sampleChats = await this.createSampleChats();
        chats.push(...sampleChats);
        console.log(`⚠️ Using sample data (${chats.length} chats)`);
      }
      
      return {
        chats,
        totalChats: chats.length,
        totalMessages: chats.reduce((total, chat) => total + chat.messageCount, 0)
      };
    } catch (error) {
      console.error('Error loading chats:', error);
      
      // Fallback to sample data on error
      const sampleChats = await this.createSampleChats();
      return {
        chats: sampleChats,
        totalChats: sampleChats.length,
        totalMessages: sampleChats.reduce((total, chat) => total + chat.messageCount, 0)
      };
    }
  }
  
  private static async loadProcessedChats(): Promise<ProcessedChatData | null> {
    try {
      // In a real application, this would be an API call or file upload
      // For now, we'll try to import the processed JSON file
      const response = await fetch('/src/data/processedChats.json');
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.warn('Could not load processed chats:', error);
      return null;
    }
  }
  
  private static async createSampleChats(): Promise<ParsedChat[]> {
    // Sample chat data based on the files we saw
    const sampleChatData = [
      {
        name: 'Акнур & +7 705 444 1059',
        content: `[06.09.2025, 18:48:36] ‪+7 705 444 1059‬: Привет, маган акша керек ед. Я поэтому продавала айкос. Можешь скинуть ?
‎[06.09.2025, 18:49:06] Акнур: ‎audio omitted
[06.09.2025, 18:49:26] ‪+7 705 444 1059‬: да
[06.09.2025, 18:49:48] ‪+7 705 444 1059‬: хорошо спасибо
[06.09.2025, 18:49:50] Акнур: Рахмееет большой🙌❤️❤️❤️
‎[06.09.2025, 18:49:54] ‪+7 705 444 1059‬: ‎sticker omitted
[06.09.2025, 18:50:00] Акнур: Как потусили
[06.09.2025, 18:50:00] Акнур: Вчера
[06.09.2025, 18:50:18] ‪+7 705 444 1059‬: ахуенно 
нихуя не помню
[06.09.2025, 18:50:21] ‪+7 705 444 1059‬: значит хорошо
[06.09.2025, 18:50:24] Акнур: УХАХХАХААХ
[06.09.2025, 18:50:24] ‪+7 705 444 1059‬: 😂😂😂
[06.09.2025, 18:50:29] Акнур: познакомились
[06.09.2025, 18:50:30] Акнур: С кем то
[06.09.2025, 18:50:33] Акнур: А свиданка че
[06.09.2025, 18:50:54] ‪+7 705 444 1059‬: я же не пошла на тренеровку
[06.09.2025, 18:51:06] ‪+7 705 444 1059‬: дэнчик же собиралссь
‎[06.09.2025, 18:51:26] ‪+7 705 444 1059‬: ‎audio omitted
[06.09.2025, 18:51:30] Акнур: Она со своим парнем?
[06.09.2025, 18:51:32] Акнур: Или новый?
[06.09.2025, 18:51:45] ‪+7 705 444 1059‬: она рассталась же
[06.09.2025, 18:51:54] ‪+7 705 444 1059‬: с шымкенскийм который
[06.09.2025, 18:51:58] Акнур: Ну БЛЕТЯЬ давно пора
[06.09.2025, 18:51:59] Акнур: Было
[06.09.2025, 18:52:00] Акнур: 🤣🤣🤣🤣
[06.09.2025, 18:52:04] Акнур: Новые же ждут
[06.09.2025, 18:52:05] Акнур: 🤣🤣🤣
[06.09.2025, 18:52:17] ‪+7 705 444 1059‬: 🤣🤣🤣🤣🤣
[06.09.2025, 18:52:32] ‪+7 705 444 1059‬: я теперь не по теме одна в отношениях`,
        mediaFiles: []
      },
      {
        name: 'Thomas',
        content: `[15.04.2025, 21:57:44] Thomas: 👋
[15.04.2025, 21:59:45] Thomas: ‎Video call  ‎13 min
[15.04.2025, 22:12:49] Акнур: ‎Video call  ‎Ended
[15.04.2025, 22:19:51] Thomas: Grenoble
[15.04.2025, 22:21:42] Thomas: Nice
[15.04.2025, 22:29:59] Thomas: I just go to the
‎[15.04.2025, 22:30:12] Thomas: ‎sticker omitted
[15.04.2025, 22:31:21] Акнур: so, my battery is dead, I'm charging my phone now, but you can write here
[15.04.2025, 22:31:24] Акнур: Okay
[15.04.2025, 22:31:25] Акнур: 🤣🤣🤣🤣
[15.04.2025, 23:15:19] Акнур: so, I hope that I will apply for a Schengen visa again in August to go to France then
[15.04.2025, 23:19:15] Thomas: Yessssssss I Hope so tooooo
‎[15.04.2025, 23:25:35] Thomas: ‎sticker omitted
[15.04.2025, 23:50:43] Акнур: So cute
[15.04.2025, 23:50:46] Акнур: 🤌🤌🤌
[16.04.2025, 00:05:15] Акнур: By the way, who do you live with in Paris?
[16.04.2025, 00:07:32] Thomas: I have a girlfriend since 2 months
[16.04.2025, 00:07:44] Thomas: For the moment
[16.04.2025, 00:07:49] Thomas: I live Alone
[16.04.2025, 00:08:04] Thomas: For me
[16.04.2025, 00:08:15] Thomas: It s the firdt Time
[16.04.2025, 00:08:24] Thomas: First Time
[16.04.2025, 00:08:34] Thomas: I have a girl friend
[16.04.2025, 00:08:40] Thomas: And also
[16.04.2025, 00:08:53] Thomas: This week-end I showed
[16.04.2025, 00:08:58] Thomas: To my parents
[16.04.2025, 00:09:04] Thomas: It was cool
[16.04.2025, 00:09:21] Thomas: She as done psychologist studies
[16.04.2025, 00:09:39] Thomas: Now she works as a seller in the luxury
[16.04.2025, 00:09:44] Thomas: And she loves that`,
        mediaFiles: ['-0000001-PHOTO-2025-08-31-01-13-54.jpg', '-0000006-PHOTO-2025-08-29-22-23-38.jpg']
      },
      {
        name: 'Адильхан лор',
        content: `[18.05.2025, 03:44:17] Адильхан лор: ‎Your security code with Адильхан лор changed.
[08.07.2025, 12:50:28] Акнур: Че там
[08.07.2025, 12:51:05] Адильхан лор: У тебя спец какая?
[08.07.2025, 12:51:15] Акнур: Онкология
[08.07.2025, 12:51:17] Акнур: Взрослая
[08.07.2025, 12:51:47] Адильхан лор: Поступить тяжко?
[08.07.2025, 12:51:56] Акнур: Позвонить сможешь?
[08.07.2025, 12:51:58] Адильхан лор: Спрашивает просто
[08.07.2025, 12:52:03] Адильхан лор: На грант типа
[08.07.2025, 12:52:05] Адильхан лор: Ща
[08.07.2025, 12:52:06] Адильхан лор: Чуть позже
[08.07.2025, 12:52:10] Адильхан лор: С работы выйду
[08.07.2025, 12:52:11] Акнур: Ок звандайсын го
[08.07.2025, 12:52:17] Адильхан лор: Окок
[08.07.2025, 12:52:23] Адильхан лор: Связь бар ма?😂
[08.07.2025, 12:52:34] Акнур: Позвони
[08.07.2025, 12:53:46] Адильхан лор: Ок
[08.07.2025, 13:41:35] Акнур: Вообще Ким?
[08.07.2025, 14:46:19] Акнур: Туф Адильхан
[08.07.2025, 14:46:21] Акнур: Айтшы
[08.07.2025, 14:46:22] Акнур: Хахахахаха
[08.07.2025, 14:48:22] Адильхан лор: Каз
[08.07.2025, 14:48:25] Адильхан лор: Освобожусь
[08.07.2025, 14:48:31] Адильхан лор: Пациенты
[08.07.2025, 15:07:10] Акнур: Ок ок
[08.07.2025, 16:38:28] Акнур: Че там
[08.07.2025, 16:38:38] Акнур: Ляяя я думала осеки будут🤣🤣🤣
[08.07.2025, 16:38:39] Акнур: Кетш
[08.07.2025, 21:14:26] Адильхан лор: Только освободился)
[08.07.2025, 21:14:40] Адильхан лор: Да там знакомый интересовался`,
        mediaFiles: ['-0000001-AUDIO-2025-07-12-16-03-51.opus', '-0000002-AUDIO-2025-07-12-14-01-10.opus']
      }
    ];
    
    return sampleChatData.map(chat => 
      WhatsAppParser.parseChat(chat.content, chat.name, chat.mediaFiles)
    );
  }
  
  // Method to parse a single chat file (for future file upload functionality)
  static parseChatFile(fileContent: string, fileName: string, mediaFiles: MediaCollection | string[] = []): ParsedChat {
    const chatName = this.extractChatNameFromFileName(fileName);
    return WhatsAppParser.parseChat(fileContent, chatName, mediaFiles);
  }
  
  private static extractChatNameFromFileName(fileName: string): string {
    // Extract chat name from file path like "WhatsApp Chat - Thomas (1)/_chat.txt"
    const match = fileName.match(/WhatsApp Chat - (.+?)(?:\s\(\d+\))?(?:\/|$)/);
    if (match) {
      return match[1];
    }
    
    // Fallback for simple file names
    return fileName.replace(/\.txt$/, '').replace(/_chat$/, '').replace(/^_/, '');
  }
  
  // Method to get chat statistics
  static getChatStatistics(chats: ParsedChat[]): {
    totalMessages: number;
    totalParticipants: number;
    dateRange: { start: Date; end: Date } | null;
    messageTypes: Record<string, number>;
  } {
    if (chats.length === 0) {
      return {
        totalMessages: 0,
        totalParticipants: 0,
        dateRange: null,
        messageTypes: {}
      };
    }
    
    const allParticipants = new Set<string>();
    const messageTypes: Record<string, number> = {};
    let totalMessages = 0;
    let earliestDate = new Date();
    let latestDate = new Date(0);
    
    chats.forEach(chat => {
      chat.participants.forEach(p => allParticipants.add(p));
      totalMessages += chat.messageCount;
      
      if (chat.dateRange.start < earliestDate) {
        earliestDate = chat.dateRange.start;
      }
      if (chat.dateRange.end > latestDate) {
        latestDate = chat.dateRange.end;
      }
      
      chat.messages.forEach(message => {
        messageTypes[message.type] = (messageTypes[message.type] || 0) + 1;
      });
    });
    
    return {
      totalMessages,
      totalParticipants: allParticipants.size,
      dateRange: { start: earliestDate, end: latestDate },
      messageTypes
    };
  }
}