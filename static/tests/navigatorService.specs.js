/****************************************************************************************
 * Copyright (c) 2014 Klaus Greff, Maik Nauheim, Johannes Merkert                       *
 *                                                                                      *
 * This file is part of Findeco.                                                        *
 *                                                                                      *
 * Findeco is free software; you can redistribute it and/or modify it under             *
 * the terms of the GNU General Public License as published by the Free Software        *
 * Foundation; either version 3 of the License, or (at your option) any later           *
 * version.                                                                             *
 *                                                                                      *
 * Findeco is distributed in the hope that it will be useful, but WITHOUT ANY           *
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A      *
 * PARTICULAR PURPOSE. See the GNU General Public License for more details.             *
 *                                                                                      *
 * You should have received a copy of the GNU General Public License along with         *
 * Findeco. If not, see <http://www.gnu.org/licenses/>.                                 *
 ****************************************************************************************/
/****************************************************************************************
 * This Source Code Form is subject to the terms of the Mozilla Public                  *
 * License, v. 2.0. If a copy of the MPL was not distributed with this                  *
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.                             *
 ****************************************************************************************/

describe('FindecoNavigatorService', function() {
    var $rootScope, $location, navigatorService;

    beforeEach(function (){
        angular.mock.module('Findeco'); //For Message
        angular.mock.module('FindecoNavigatorService');
        angular.mock.inject(function(_$rootScope_, _$location_, Message, Navigator) {
            $rootScope = _$rootScope_;
            $location = _$location_;
            navigatorService = Navigator;

        });
    });

    it('should have function updatePath', function(){
        expect(angular.isFunction(navigatorService.updatePath)).toBe(true);
    });

    it('should have function changePath', function(){
       expect(angular.isFunction(navigatorService.changePath)).toBe(true);
    });

    it('should change path to /user', function(){
        navigatorService.changePath('/user');
        expect($location.path()).toBe('/user');

        navigatorService.updatePath();
        expect(navigatorService.path).toBe('/user');
    });
});