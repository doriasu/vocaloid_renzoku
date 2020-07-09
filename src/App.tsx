import React from 'react';
import {AppBar, Button, Toolbar, Typography} from "@material-ui/core";
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
                    if(e.data.data.playerStatus==4){
                        this.music_index++;
                        this.ch_music();
                        setTimeout(()=>{if(this.handler!==null) {
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
                eventName: 'play'
            }, 'https://embed.nicovideo.jp')
        }
    }

    post_msg=(e:HTMLIFrameElement)=>{
        if(e.contentWindow!==null){
            let x=e.contentWindow.postMessage({
                sourceConnectorType:1,
                eventName: 'play'
            },'https://embed.nicovideo.jp');
        }
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6">
                                ボカロランキングを連続再生してみた！
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </header>

                <iframe src={this.state.url} id="nicoplayer" ref={(e: HTMLIFrameElement) => {
                    this.handler = e
                }}>hello
                </iframe>
                <Typography>
                <div>{this.music_index + 1}位の楽曲</div>
                <div>{this.state.rank_title[this.music_index]}</div>
                </Typography>
            </div>

        );
    }
}

export default App;
