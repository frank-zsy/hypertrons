// Copyright 2019 Xlab
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
  description: 'every label type',
})
export class Role {

  @configProp({
    description: 'Role name',
    defaultValue: '',
  })
  name: string;

  @configProp({
    description: 'Role description',
    defaultValue: '',
  })
  description: string;

  @configProp({
    description: 'Users of the current role.',
    defaultValue: [],
    arrayType: 'string',
  })
  users: string[];

}

@configClass({
  description: 'Manage roles. List users of the different roles.',
})
export default class Config {

  @configProp({
    description: 'Enable this component or not',
    defaultValue: defaultConfig.enable,
  })
  enable: boolean;

  @configProp({
    description: 'Roles and the users of it',
    defaultValue: defaultConfig.roles,
    arrayType: Role,
  })
  roles: Role[];

}
