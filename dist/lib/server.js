"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Classes_1 = require("./Classes");
const path = require("path");
const fs = require("fs-extra");
const util_1 = require("util");
var Server;
(function (Server) {
    const paccess = util_1.promisify(fs.access), copy = util_1.promisify(fs.copy), ensureDir = util_1.promisify(fs.ensureDir);
    async function setup(opts, over = false) {
        let server = new Classes_1.default.Server(opts);
        await ensureDir(server.opts.serveDir);
        try {
            await Promise.all([paccess(path.join(server.opts.serveDir, server.opts.mwdir), fs.constants.R_OK | fs.constants.W_OK),
                paccess(path.join(server.opts.serveDir, server.opts.public), fs.constants.R_OK | fs.constants.W_OK),
                paccess(path.join(server.opts.serveDir, server.opts.private), fs.constants.R_OK | fs.constants.W_OK)]);
        }
        catch (err) {
            if (server.opts.builtins) {
                await Promise.all([copy(path.join(__dirname, server.opts.mwbuilt), path.join(server.opts.serveDir, server.opts.mwdir), {
                        overwrite: over
                    }),
                    copy(path.join(__dirname, server.opts.prbuilt), path.join(server.opts.serveDir, server.opts.private), {
                        overwrite: over
                    }),
                    copy(path.join(__dirname, server.opts.pubuilt), path.join(server.opts.serveDir, server.opts.public), {
                        overwrite: over
                    })]);
            }
            else {
                await Promise.all([ensureDir(path.join(server.opts.serveDir, server.opts.mwdir)),
                    ensureDir(path.join(server.opts.serveDir, server.opts.private)),
                    ensureDir(path.join(server.opts.serveDir, server.opts.public))]);
            }
        }
        return server;
    } //setup
    Server.setup = setup;
})(Server = exports.Server || (exports.Server = {})); //Server
exports.default = Server;
