import EventEmitter from "events";
import { ZodError } from "zod";
import { ApiError } from "../interfaces/http/utils/ApiError";

interface OperationEvents {
    SUCCESS: <T>(data: T) => void;
    ERROR: (error: Error | ApiError) => void;
    VALIDATION_ERROR: (err: ZodError) => void;
}

class Operation extends EventEmitter {
    emit<K extends keyof OperationEvents>(
        eventName: K,
        ...args: Parameters<OperationEvents[K]>
    ): boolean {
        return super.emit(eventName, ...args);
    }

    on<K extends keyof OperationEvents>(
        eventName: K,
        listener: OperationEvents[K]
    ): this {
        return super.on(eventName, listener);
    }
}

export { Operation };
