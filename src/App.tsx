import React from 'react';
import {Button} from "@material-ui/core";
interface Inico{
    url:string;
    id:string;
    handler:HTMLIFrameElement|null;
}
interface Inico_prop {

}
class App extends React.Component<Inico_prop,Inico>{
    constructor(props:Inico_prop) {
        super(props);
        this.state={url:"https://embed.nicovideo.jp/watch/sm37157689?jsapi=1",id:"niconico",handler:null}
        this.bind();

    }
    private handler:HTMLIFrameElement=document.createElement('iframe');
    wait(): Promise<any> {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('wait');
            }, 2000);
        })
    }


    bind() {
        window.addEventListener('message',(e)=>{
                if(e.data.eventName=="playerStatusChange"){
                    console.log("WORLF")
                    if(e.data.data.playerStatus==4){
                        console.log("HELLO")
                        this.ch_music();
                        setTimeout(()=>{if(this.handler!==null) {
                            console.log("呼ばれた気がした")
                            this.post_msg(this.handler);
                        }},2000);

                    }
                }

        })

    }
    ch_music(){
        this.setState((prevState)=>({url:"https://embed.nicovideo.jp/watch/sm37154099?jsapi=1"}));
    }

    renderPlayer(){
        if(this.handler.contentWindow!=null) {
            this.handler.contentWindow.postMessage({
                sourceConnectorType:1,
                eventName: 'pause'
            }, 'https://embed.nicovideo.jp')
            console.log("pause")
            console.log(this.handler)
        }
    }

    post_msg=(e:HTMLIFrameElement)=>{
        console.log("post_msg")
        if(e.contentWindow!==null){
            console.log("post_msg2")
            let x=e.contentWindow.postMessage({
                sourceConnectorType:1,
                eventName: 'play'
            },'https://embed.nicovideo.jp');
            console.log(x);
        }
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Button onClick={()=>this.renderPlayer()}>click</Button>
                    <iframe src={this.state.url} id="nicoplayer" ref={(e:HTMLIFrameElement)=>{this.handler=e}}>hello</iframe>
                </header>
            </div>
        );
    }
}

export default App;
