import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { AuthService } from '../api/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  entityId?: string;

  constructor(private authObj: AuthService) {
    this.entityId = this.authObj.getCurrentGreenhouse()
  }
  
  private subject?: Rx.Subject<MessageEvent>;
  
  public connect(url: string): Rx.Subject<MessageEvent>{
    if(!this.subject) {
      this.subject = this.create(url);
      console.log("Connect Success: " + url);
    }
    return this.subject;
  }

  private create(url: string): Rx.Subject<MessageEvent> {
    let ws = new WebSocket(url);
    console.log("crete socket")
    let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });

    let entityId = this.entityId;
    // ws.onopen = function () {
    //   console.log("send config")
    //     var object = {
    //         tsSubCmds: [
    //             {
    //                 entityType: "DEVICE",
    //                 entityId: entityId,
    //                 scope: "LATEST_TELEMETRY",
    //                 cmdId: 0
    //             }
    //         ],
    //         historyCmds: [],
    //         attrSubCmds: []
    //     };
    //     var data = JSON.stringify(object);
    //     ws.send(data);
    // }

    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          console.log("send Data"+ data)
          ws.send(JSON.stringify(data));
        } else if (ws.readyState === WebSocket.CLOSED) {
          // window.location.href = "./#/login";
        }
      }
    };

    return Rx.Subject.create(observer, observable);
  }
}
