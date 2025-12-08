import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import mitt from "mitt";
import { TOPICS } from "../data/topics";

class WebSocketService {
  private static instance: WebSocketService;
  private stompClient: Client | null = null;
  private subscriptions: StompSubscription[] = [];
  private eventEmitter = mitt();
  private subscribedConversationIds: Set<number> = new Set();
  private userId: number | null = null;

  WS_URL = import.meta.env.VITE_WS_URL;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public getStompClient() {
    return this.stompClient;
  }

  connect(userId: number, conversationIds: number[] = []) {
    if (this.stompClient?.active) {
      console.log("WebSocket already connected, updating subscriptions.");
      this.subscribeToTopics(userId, conversationIds);
      return;
    }

    this.userId = userId;
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.WS_URL),
      debug: (str) => console.log("[WebSocket Debug]", str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket connected!");
        this.subscribeToTopics(userId, conversationIds);
      },
      onStompError: (frame) => {
        console.error("❌ WebSocket error:", frame);
      },
      onDisconnect: () => {
        console.log("❌ WebSocket disconnected!");
        this.subscribedConversationIds.clear();
        this.subscriptions = [];
      },
    });

    this.stompClient.activate();
  }

  isConnected(): boolean {
    return this.stompClient?.active ?? false;
  }

  subscribeToTopics(userId: number, conversationIds: number[]) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket is not connected. Cannot subscribe to topics.");
      return;
    }

    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.subscribedConversationIds.clear();
    this.userId = userId;

    // Subscribe to unread count topic
    const unreadCountTopic = TOPICS.UNREAD_COUNT(userId.toString());
    const unreadCountSubscription = this.stompClient.subscribe(
      unreadCountTopic,
      (message) => {
        const data = JSON.parse(message.body);
        console.log(`📩 Received from ${unreadCountTopic}:`, data);
        this.eventEmitter.emit(unreadCountTopic, data);
      }
    );
    if (unreadCountSubscription) {
      this.subscriptions.push(unreadCountSubscription);
    }

    // Subscribe to conversation meta topic
    const metaTopic = TOPICS.CONVERSATION_DATA(userId.toString());
    const metaSubscription = this.stompClient.subscribe(
      metaTopic,
      (message) => {
        const data = JSON.parse(message.body);
        console.log(`📩 Received from ${metaTopic}:`, data);
        this.eventEmitter.emit(metaTopic, data);
      }
    );
    if (metaSubscription) {
      this.subscriptions.push(metaSubscription);
    }

    // Subscribe to notification topic
    const notificationTopic = TOPICS.NOTIFICATION(userId.toString());
    const notificationSubscription = this.stompClient.subscribe(
      notificationTopic,
      (message) => {
        const data = JSON.parse(message.body);
        console.log(`📩 Received from ${notificationTopic}:`, data);
        this.eventEmitter.emit(notificationTopic, data);
      }
    );
    if (notificationSubscription) {
      this.subscriptions.push(notificationSubscription);
    }

    // Subscribe to conversation topics
    conversationIds.forEach((id) => {
      const conversationTopic = TOPICS.CONVERSATION(id.toString());
      const conversationSubscription = this.stompClient?.subscribe(
        conversationTopic,
        (message) => {
          const data = JSON.parse(message.body);
          console.log(`📩 Received from ${conversationTopic}:`, data);
          this.eventEmitter.emit(conversationTopic, data);
        }
      );
      if (conversationSubscription) {
        this.subscriptions.push(conversationSubscription);
        this.subscribedConversationIds.add(id);
      }

      const metaConversationTopic = TOPICS.CONVERSATION_DATA(id.toString());
      const metaConversationSubscription = this.stompClient?.subscribe(
        metaConversationTopic,
        (message) => {
          const data = JSON.parse(message.body);
          console.log(`📩 Received from ${metaConversationTopic}:`, data);
          this.eventEmitter.emit(metaConversationTopic, data);
        }
      );
      if (metaConversationSubscription) {
        this.subscriptions.push(metaConversationSubscription);
        this.subscribedConversationIds.add(id);
      }
    });

    console.log("✅ Subscribed to:", [
      unreadCountTopic,
      metaTopic,
      notificationTopic,
      ...conversationIds.map((id) => TOPICS.CONVERSATION(id.toString())),
      ...conversationIds.map((id) => TOPICS.CONVERSATION_DATA(id.toString())),
    ]);
  }

  subscribeToConversation(conversationId: number) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error(
        "WebSocket is not connected. Cannot subscribe to conversation."
      );
      return;
    }

    if (this.subscribedConversationIds.has(conversationId)) {
      console.log(`Already subscribed to conversation ${conversationId}`);
      return;
    }

    const conversationTopic = TOPICS.CONVERSATION(conversationId.toString());
    const conversationSubscription = this.stompClient.subscribe(
      conversationTopic,
      (message) => {
        const data = JSON.parse(message.body);
        console.log(`📩 Received from ${conversationTopic}:`, data);
        this.eventEmitter.emit(conversationTopic, data);
      }
    );

    const metaTopic = TOPICS.CONVERSATION_DATA(conversationId.toString());
    const metaSubscription = this.stompClient.subscribe(
      metaTopic,
      (message) => {
        const data = JSON.parse(message.body);
        console.log(`📩 Received from ${metaTopic}:`, data);
        this.eventEmitter.emit(metaTopic, data);
      }
    );

    if (conversationSubscription) {
      this.subscriptions.push(conversationSubscription);
      this.subscribedConversationIds.add(conversationId);
    }
    if (metaSubscription) {
      this.subscriptions.push(metaSubscription);
      this.subscribedConversationIds.add(conversationId);
    }

    console.log(`✅ Subscribed to conversation ${conversationId}:`, [
      conversationTopic,
      metaTopic,
    ]);
  }

  private extractConversationId(topic: string): string | null {
    const match =
      topic.match(/\/topic\/conversation\/(\d+)/) ||
      topic.match(/\/topic\/conversation-meta\/(\d+)/) ||
      topic.match(/\/topic\/notifications\/(\d+)/);
    return match ? match[1] : null;
  }

  disconnect() {
    if (this.isConnected()) {
      this.stompClient?.deactivate();
      this.subscriptions.forEach((sub) => sub.unsubscribe());
      this.subscriptions = [];
      this.subscribedConversationIds.clear();
      this.userId = null;
      console.log("✅ WebSocket disconnected and cleaned up.");
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    console.log(`📍 Subscribing to event: ${event}`);
    this.eventEmitter.on(event, callback);
  }

  unsubscribe(event: string, callback: (data: any) => void) {
    this.eventEmitter.off(event, callback);
  }

  getUserId(): number | null {
    return this.userId;
  }

  sendMessage(destination: string, message: any) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket is not connected. Cannot send message.");
      return false;
    }

    try {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(message),
      });
      console.log(`📤 Sent to ${destination}:`, message);
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  }
}

export default WebSocketService;
