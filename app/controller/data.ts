
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

export default class Data extends Controller {

  private baseUrl = 'https://img.shields.io/badge/';

  public async get() {
    const { installationName, owner, repo } = this.ctx.params;
    const type = this.ctx.queries.type;
    if (!installationName || !owner || !repo || !type || !Array.isArray(type) || type.length !== 1) {
      this.ctx.body = 'PARAM ERROR';
      return;
    }
    const client = await this.app.installation.getHostingClientByInstallationName(installationName, getRepoFullName(owner, repo));
    if (!client) {
      this.ctx.body = 'Client not found';
      return;
    }
    const data = client.getRepoData();
    if (!data) {
      this.ctx.body = 'Data not ready';
      return;
    }
    const t = type[0];
    let status = '0';
    let color = 'green';
    if (t === 'contributor') {
      status = data.contributors.length.toString();
    } else if (t === 'open_issue') {
      status = data.issues.filter(i => !i.closedAt).length.toString();
    } else if (t === 'issue') {
      status = data.issues.length.toString();
    } else if (t === 'open_pull') {
      status = data.pulls.filter(p => !p.closedAt).length.toString();
    } else if (t === 'pull') {
      status = data.pulls.length.toString();
    } else if (t === 'participant') {
      const set = new Set<string>();
      data.issues.forEach(i => {
        set.add(i.author);
        i.comments.forEach(c => set.add(c.login));
      });
      data.pulls.forEach(p => {
        set.add(p.author);
        p.comments.forEach(c => set.add(c.login));
        p.reviewComments.forEach(r => set.add(r.login));
      });
      status = set.size.toString();
    } else if (t === 'follower') {
      const set = new Set<string>();
      data.stars.forEach(s => set.add(s.login));
      data.forks.forEach(f => set.add(f.login));
      status = set.size.toString();
    } else if (t === 'activity') {
      const scoreMap = new Map<string, number>();
      const addContribution = (login: string, score: number) => {
        scoreMap.set(login, (scoreMap.get(login) ?? 0) + score);
      };
      data.issues.forEach(i => {
        addContribution(i.author, 2);
        i.comments.forEach(c => addContribution(c.login, 1));
      });
      data.pulls.forEach(p => {
        addContribution(p.author, 3);
        p.comments.forEach(c => addContribution(c.login, 1));
        p.reviewComments.forEach(r => addContribution(r.login, 4));
        if (p.mergedAt) {
          addContribution(p.author, 5);
        }
      });
      data.stars.forEach(s => addContribution(s.login, 1));
      data.forks.forEach(f => addContribution(f.login, 2));
      let score = 0;
      for (const s of scoreMap) {
        score += Math.sqrt(s[1]);
      }
      status = Math.round(score).toString();
    } else {
      status = 'invalid type';
      color = 'red';
    }
    this.ctx.redirect(`${this.baseUrl}${type}-${status}-${color}`);
  }
}
