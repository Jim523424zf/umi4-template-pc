import { logUtil } from "./logUtil";

type WebSocketClientOptions = {
  maxRetries?: number;
  retryInterval?: number;
  onOpen?: () => void;
  onMessage?: (event: MessageEvent) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onReconnecting?: () => void;
};

export class WebSocketClient {
  private url: string;
  private options: Required<WebSocketClientOptions>;
  private socket: WebSocket | null;
  private retryCount: number;
  private retryTimer: NodeJS.Timeout | null;
  private status: "disconnected" | "connecting" | "connected" | "reconnecting";

  constructor(url: string, options: WebSocketClientOptions = {}) {
    this.url = url;
    this.options = Object.assign(
      {
        maxRetries: Infinity,
        retryInterval: 15000,
        onOpen: null,
        onMessage: null,
        onClose: null,
        onError: null,
        onReconnecting: null,
      },
      options,
    );
    this.socket = null;
    this.retryCount = 0;
    this.retryTimer = null;
    this.status = "disconnected";
  }

  public connect(): void {
    if (this.status === "connected" || this.status === "connecting") {
      logUtil.error("WebSocket is already connected or connecting");
      return;
    }

    this.status = "connecting";
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      logUtil.log("WebSocket connected");
      this.retryCount = 0;
      this.status = "connected";
      if (this.options.onOpen) {
        this.options.onOpen();
      }
    };

    this.socket.onmessage = (event) => {
      logUtil.log(`Received message: ${event.data}`);
      if (this.options.onMessage) {
        this.options.onMessage(event);
      }
    };

    this.socket.onclose = (event) => {
      logUtil.log(`WebSocket closed with code ${event.code}`);
      this.socket = null;
      this.status = "disconnected";
      if (this.options.onClose) {
        this.options.onClose(event);
      }
      if (this.retryCount < this.options.maxRetries || this.options.maxRetries === Infinity) {
        this.retryTimer = setTimeout(() => {
          logUtil.log("WebSocket reconnecting...");
          this.status = "reconnecting";
          if (this.options.onReconnecting) {
            this.options.onReconnecting();
          }
          this.connect();
          this.retryCount++;
        }, this.options.retryInterval);
      } else {
        logUtil.error("WebSocket connection failed");
      }
    };

    this.socket.onerror = (error) => {
      logUtil.error(`WebSocket error: `, error);
      if (this.options.onError) {
        this.options.onError(error);
      }
    };
  }

  public send(message: string): void {
    if (this.status !== "connected") {
      logUtil.error("WebSocket is not connected");
      return;
    }

    logUtil.log(`Sending message: ${message}`);
    this.socket?.send(message);
  }

  public close(): void {
    if (this.status === "disconnected") {
      logUtil.error("WebSocket is not connected or connecting");
      return;
    }

    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }

    this.socket?.close();
    this.socket = null;
    this.status = "disconnected";
  }
}
