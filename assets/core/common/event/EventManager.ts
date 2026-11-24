import { oops } from "../../Oops";
import { EventMessage, ListenerFunc } from "./EventMessage";


type eventType = EventMessage 
export class EventManager {
    static on(event: eventType, listener: ListenerFunc, object: object) {
        oops.message.on(event, listener, object);
    }
    static once(event: eventType, listener: ListenerFunc, object: object) {
        oops.message.once(event, listener, object);
    }  
    static off(event: eventType, listener: ListenerFunc, object: object) {    
        oops.message.off(event, listener, object);
    }
    static dispatchEvent(event: eventType, ...args: any[]) {
        oops.message.dispatchEvent(event, ...args);
    }
}