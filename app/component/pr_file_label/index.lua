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

-- Pull label by files
on('PullRequestEvent', function (e)
  wrap(function()
    if (e.action == 'opened' or e.action == 'synchronize') then
      local files = listPullRequestFiles(e.number)
      log('Gonna add PR label by files for '..e.number..', find '..#files..' files in PR')
      local labels = {}
      for i=1, #files do
        for j=1, #compConfig.rules do
          if (arrayContains(compConfig.rules[j].files, function (regex)
            return string.match(files[i].filename, regex) ~= nil
          end)) then
            table.insert(labels, compConfig.rules[j].label)
          end
        end
      end
      if (#labels ~= 0) then
        addLabels(e.number, tableUnique(labels))
      end
    end
  end)
end)
