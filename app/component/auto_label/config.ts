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
  description: 'Auto label config',
})
export default class Config {

  @configProp({
    description: 'Auto label only be triggered when the event contains the following actions',
    type: 'array',
    arrayType: 'string',
    defaultValue: defaultConfig.actions,
  })
  actions: string[];

  @configProp({
    description: 'Listened events',
    type: 'array',
    arrayType: 'string',
    defaultValue: defaultConfig.events,
  })
  events: string[];

}
