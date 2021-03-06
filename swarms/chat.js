/**
 *
 * Chat swarm
 */
var addChatMsgSwarming =
{
    meta:{
        name:"chat.js"
    },
    vars:{
        debug:false
    },
    newMessage:function(roomId,userId,date,message,userFriendlyRoomName){
        this.userFriendlyRoomName = userFriendlyRoomName;
        this.roomId     = roomId;
        this.userId     = userId;
        this.date       = date;
        this.message    = message;
        this.swarm("recordMsg");
    },
    getPage:function(roomId, start, end){
        this.roomId     = roomId;
        this.start      = start;
        this.end        = end;
        this.swarm("returnPage");
    },
    deleteRoomMessages:function(roomId){
        this.roomId     = roomId;
        this.swarm("doClean");
    },
    recordMsg:{
        node:"ChatServices",
        code : function (){
            saveChatMessage(this.roomId,this.userId,this.date,this.message);
            this.swarm("notifyAll");
        }
    },
    doClean:{
        node:"ChatServices",
        code : function (){
            cleanRoom(this.roomId);
        }
    },
    returnPage:{
        node:"ChatServices",
        code : function (){
            var f = function(pageArray){
                this.pageArray = pageArray;
                this.home("pageAnswer");
            }.bind(this);
            getPage(this.roomId,this.start,this.end,f);
        }
    },
    notifyAll:{   //phase
        node:"ChatServices",
        code : function (){
            getFollowers(this.roomId, function(reply)
            {
                //cprint("Followers:" + reply);
                for(var i=0;i<reply.length;i++) {
                    this.currentTargetUser = reply[i];
                    this.toUser(this.currentTargetUser);
                }
            }.bind(this) );
        }
    },
    notifyChatMessage:{ //notify different clients about a new chat message
        node:"$client",
        code : null
    },
    pageAnswer:{        //return a page on a client
        node:"$client",
        code : null
    },
    mailNotification:{   //phase executed on connected clients that are following a room and should get notified about a new chat message
        node:"mailNotificator",
        code : function (){
            //this.scheduleNotification("1d",this.roomId,"New chat message for " + this.userFriendlyRoomName);
        }
    }
};

addChatMsgSwarming;