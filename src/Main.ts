//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {



    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {


        RES.processor.map("json", new JSONProcessor())
        this.runGame()
    }

    private async runGame() {
        await this.loadResource()


    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            const json = RES.getRes("1_json");
            console.log(json)

            const texture = await RES.getResAsync("bg_jpg");
            const bg = new egret.Bitmap();
            bg.texture = texture;
            this.stage.addChild(bg)
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }
}

class JSONProcessor implements RES.processor.Processor {

    private totalContent: any;

    async onLoadStart(host: RES.ProcessHost, resource: RES.ResourceInfo): Promise<any> {
        console.log('load json', resource.url)
        if (resource.url.indexOf("config/") == -1) {
            return host.load(resource, RES.processor.JsonProcessor)
        }
        else {
            if (!this.totalContent) {
                const name = "total_json";
                if (!RES.hasRes(name)) {
                    const url = "total.json";
                    const type = 'json';
                    const root = RES.config.config.resourceRoot;
                    const resource = { name, url, type, root };
                    RES.$addResourceData(resource);
                    this.totalContent = await RES.getResAsync(name)
                }
                else {
                    await RES.getResAsync(name)
                }
            }
            return this.totalContent[resource.url];
        }
    }

    onRemoveStart(host: RES.ProcessHost, resource: RES.ResourceInfo): Promise<any> {
        return Promise.resolve();
    }
}