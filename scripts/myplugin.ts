export class MergeJSONPlugin implements plugins.Command {

    private obj = {};

    constructor() {
    }

    async onFile(file: plugins.File) {

        if (file.extname == '.json' // JSON 文件参与合并
            && file.origin.indexOf("resource/config/") == 0) { // 只有 resource/config 文件夹中的文件参与合并

            const url = file.origin.replace("resource/", "");
            const content = file.contents.toString()
            this.obj[url] = JSON.parse(content);
        }
        return file;
    }

    async onFinish(commandContext: plugins.CommandContext) {
        commandContext.createFile('resource/total.json', new Buffer(JSON.stringify(this.obj)));
    }
}