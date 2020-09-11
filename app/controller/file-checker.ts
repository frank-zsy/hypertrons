// Copyright 2019 - present Xlab
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Controller } from 'egg';
import { getRepoFullName } from '../basic/Utils';

export default class FileChecker extends Controller {
  private baseUrl = 'https://img.shields.io/badge/';

  public async get() {
    const { installationName, owner, repo } = this.ctx.params;
    const path = this.ctx.queries.path;
    if (!installationName || !owner || !repo || !path || !Array.isArray(path) || path.length !== 1) {
      this.ctx.body = 'PARAM ERROR';
      return;
    }
    const client = await this.app.installation.getHostingClientByInstallationName(installationName, getRepoFullName(owner, repo));
    if (!client) {
      this.ctx.body = 'Client not found';
      return;
    }
    const file = await client.getFileContent(path[0]);
    const fileName = encodeURIComponent(path[0]);
    let status = 'check';
    let color = 'green';
    if (!file || !file.content) {
      status = 'missing';
      color = 'red';
    }
    this.ctx.redirect(`${this.baseUrl}${fileName}-${status}-${color}`);
  }
}
