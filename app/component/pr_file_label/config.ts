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

import { configClass, configProp } from '../../config-generator/decorators';
import defaultConfig from './defaultConfig';

@configClass({
  description: 'Config for a kind of file',
})
export class ConfigItem {

  @configProp({
    description: 'PR file match regex',
    defaultValue: [],
    type: 'array',
    arrayType: 'string',
  })
  files: string[];

  @configProp({
    description: 'If match regex, should add this label',
    defaultValue: '',
  })
  label: string;
}

@configClass({
  description: 'PR file label config',
})
export default class Config {

  @configProp({
    description: 'Rules of adding label to PR by files',
    defaultValue: [],
    type: 'array',
    arrayType: defaultConfig.rules,
  })
  rules: ConfigItem[];

}
