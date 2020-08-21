-- Copyright 2019 - present Xlab
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.

-- PR UML renderer
on('PullRequestEvent', function (e)
  wrap(function()
    if (e.action == 'opened' or e.action == 'synchronize') then
      local files = listPullRequestFiles(e.number)
      log('Gonna check uml for '..e.number..', find '..#files..' files in PR')
      if (#files == 0) then
        return
      end

      local comment = ''
      for i=1, #files do
        local filename = files[i].filename
        local contentsUrl = files[i].contents_url
        local ref = string.match(contentsUrl, '.*?ref=(%w+)')
        local checkRes = string.match(filename, compConfig.fileRegex)
        if (checkRes ~= nil) then
          log('Find '..filename..' in PR '..e.number)
          local content = getFileContent(filename, ref).content
          comment = comment..rendStr(compConfig.commentItem, {
            ['file'] = filename,
            ['url'] = generateUmlUrl(content)
          })
        end
      end

      if (comment ~= '') then
        addIssueComment(e.number, comment)
      end
    end
  end)
end)
