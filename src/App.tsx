import React from 'react';
import {Button} from "@material-ui/core";
import axios from "axios"
interface Inico{
    url:string;
    id:string;
    rank_url:string[];
    rank_title:string[];
}
interface Inico_prop {

}
class App extends React.Component<Inico_prop,Inico>{
    constructor(props:Inico_prop) {
        super(props);
        this.state={url:"",id:"niconico",rank_url:[],rank_title:[]}
        this.bind();
        this.get_ranking();

    }
    private handler:HTMLIFrameElement=document.createElement('iframe');
    private music_index:number=0;
    wait(): Promise<any> {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('wait');
            }, 2000);
        })
    }
    async get_ranking(){
        const res=await axios.get("https://niconico-vocaloid-ranking.herokuapp.com/ranking_api/?ranking");
        this.setState({rank_url:res.data.url,rank_title:res.data.title,url:res.data.url[0]});
    }


    bind() {
        window.addEventListener('message',(e)=>{
                if(e.data.eventName=="playerStatusChange"){
                    console.log("WORLF")
                    if(e.data.data.playerStatus==4){
                        console.log("HELLO")
                        this.music_index++;
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
        this.setState((prevState)=>({url:this.state.rank_url[this.music_index]}));
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
                    <iframe src={this.state.url} id="nicoplayer" ref={(e:HTMLIFrameElement)=>{this.handler=e}}>hello</iframe>
                    <div>{this.music_index+1}位の楽曲</div>
                    <div>{this.state.rank_title[this.music_index]}</div>
                </header>
            </div>
        );
    }
}

export default App;
