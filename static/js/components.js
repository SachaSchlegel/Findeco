/****************************************************************************************
 * Copyright (c) 2012 Justus Wingert, Klaus Greff, Maik Nauheim, Johannes Merkert       *
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

//////////////////// findeco-graph Directive ///////////////////////////////////
/*
 <div follow-star entity="data" markFunc="markNode"/>
 */
findecoApp
    .directive('followStar', function () {
        return {
            restrict: 'A',
            scope   : {
                entity  : '=',
                markFunc: '=',
                showIf  : '=',
                width   : '@',
                height  : '@'
            },
            replace : true,
            template: '<a class="follow-star" ng-mouseenter="startHover()" ng-mouseleave="stopHover()"></a>',
            link: function (scope, element, attrs) {
                if (scope.entity.isFollowing != 0 &&
                    scope.entity.isFollowing != 1 &&
                    scope.entity.isFollowing != 2) {
                    scope.entity.isFollowing = 0;
                }
                var link = angular.element(element[0]);
                scope.$watch('showIf', function (value) {
                    link.css('display', scope.showIf ? '' : 'none');
                });
                scope.$watch('width', function (newWidth) {
                    if (newWidth) {
                        element.width(newWidth + 'px');
                    }
                    element.css({'background-size': Math.max(scope.width, scope.height) * 2 + 'px'});
                });
                scope.$watch('height', function (newHeight) {
                    if (newHeight) {
                        element.height(newHeight + 'px');
                    }
                    element.css({'background-size': Math.max(scope.width, scope.height) * 2 + 'px'});
                });
                scope.setBackgroundPosition = function () {
                    var x = 0;
                    if (scope.hover) {
                        x = -Math.max(scope.width, scope.height);
                    }
                    var y = scope.entity.isFollowing * -Math.max(scope.width, scope.height);
                    element.css({'background-position': x + 'px ' + y + 'px'});
                };
                scope.$watch('entity.isFollowing', function () {
                    scope.setBackgroundPosition();
                });
                scope.startHover = function () {
                    scope.hover = true;
                    scope.setBackgroundPosition();
                };
                scope.stopHover = function () {
                    scope.hover = false;
                    scope.setBackgroundPosition();
                };
                link.bind('click', toggle);
                function toggle() {
                    var markType = "follow";
                    if (scope.entity.isFollowing == 2) {
                        markType = "unfollow";
                    }
                    scope.markFunc(markType, scope.entity.path).success(function () {
                        if (markType == 'unfollow') {
                            scope.entity.isFollowing = 0;
                        } else {
                            scope.entity.isFollowing = 2;
                        }
                    });
                }
            }
        }
    })
    .directive('spamMark', function () {
        return {
            restrict: 'A',
            scope   : {
                entity  : '=',
                markFunc: '=',
                showIf  : '=',
                width   : '@',
                height  : '@'
            },
            replace : true,
            template: '<a class="spam-mark" ng-mouseenter="startHover()" ng-mouseleave="stopHover()"></a>',
            link    : function (scope, element, attrs) {
                if (scope.entity.isFlagging != 0 &&
                    scope.entity.isFlagging != 1 &&
                    scope.entity.isFlagging != 2) {
                    scope.entity.isFlagging = 0;
                }
                var link = angular.element(element[0]);
                scope.$watch('showIf', function (value) {
                    link.css('display', scope.showIf ? '' : 'none');
                });
                scope.$watch('width', function (newWidth) {
                    if (newWidth) {
                        element.width(newWidth + 'px');
                    }
                    element.css({'background-size': Math.max(scope.width, scope.height) * 2 + 'px'});
                });
                scope.$watch('height', function (newHeight) {
                    if (newHeight) {
                        element.height(newHeight + 'px');
                    }
                    element.css({'background-size': Math.max(scope.width, scope.height) * 2 + 'px'});
                });
                scope.setBackgroundPosition = function () {
                    var x = 0;
                    if (scope.hover) {
                        x = -Math.max(scope.width, scope.height);
                    }
                    var y = 0;
                    if (!scope.entity.isFlagging) {
                        y = -Math.max(scope.width, scope.height);
                    }
                    element.css({'background-position': x + 'px ' + y + 'px'});
                };
                scope.$watch('entity.isFollowing', function () {
                    scope.setBackgroundPosition();
                });
                scope.startHover = function () {
                    scope.hover = true;
                    scope.setBackgroundPosition();
                };
                scope.stopHover = function () {
                    scope.hover = false;
                    scope.setBackgroundPosition();
                };
                link.bind('click', toggle);
                function toggle() {
                    var markType = "spam";
                    if (scope.entity.isFlagging == 1) {
                        markType = "notspam";
                    }
                    scope.markFunc(markType, scope.entity.path).success(function () {
                        if (markType == 'notspam') {
                            scope.entity.isFlagging = 0;
                        } else {
                            scope.entity.isFlagging = 1;
                        }
                    });
                }
            }
        }
    })
    .directive('creole', function () {
        return {
            restrict: 'A',
            scope   : {
                wikiText      : '=',
                updateInterval: '@'
            },
            link    : function (scope, element, attrs) {
                function parse() {
                    if (scope.wikiText != undefined) {
                        var html = Parser.parse(scope.wikiText, "unusedShortTitle", true);
                        element.html(html);
                    }
                }

                function check_for_parse_timing() {
                    var now = new Date().getTime();
                    var interval = parseInt(scope.updateInterval);
                    if (now >= scope.nextParseTime &&
                        scope.lastChangeTime >= now - interval) {
                        parse();
                        scope.nextParseTime = now + interval;
                        setTimeout(check_for_parse_timing, interval + 10);
                    }
                }

                if (scope.updateInterval == undefined) {
                    scope.$watch('wikiText', function () {
                        parse();
                    });
                } else {
                    scope.nextParseTime = 0;
                    scope.lastChangeTime = 0;
                    scope.$watch('wikiText', function () {
                        var now = new Date().getTime();
                        scope.nextParseTime = Math.max(scope.nextParseTime, now + 1000);
                        scope.lastChangeTime = now;
                        setTimeout(check_for_parse_timing, 1000);
                    });
                }
                parse();
            }
        }
    })
    .directive('help', function (Help, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                help: '=',
                htype: '=',
                hid: '@hid'
            },
            template: '<div style="float: left;">Platzhalter</div>',
            replace: true,
            link: function (scope, elem, attr) {
                $rootScope.$watch('helpIsActive', function (newVal, oldVal) {
                    if (newVal) {
                        elem.html('<div class="help-small-icon help-small-b "></div>');
                        if (scope.htype == 1) {
                            elem.html('<div class="help-small-icon help-small-b " ></div>');
                        }
                        if (scope.htype == 3) {
                            elem.html('<div class="help-small-icon help-small-b "  ></div>');
                        }

                    } else {
                        elem.html('');
                    }
                });
                var link = angular.element(elem[0]);
                link.bind('click', function () {
                    Help.setID(scope.hid);
                });
            }

        };
    })
    .directive('ngBindHtmlUnsafe', [function () {
        return function (scope, element, attr) {
            element.addClass('ng-binding').data('$binding', attr.ngBindHtmlUnsafe);
            scope.$watch(attr.ngBindHtmlUnsafe, function ngBindHtmlUnsafeWatchAction(value) {
                element.html(value || '');
            });
        }
    }])
    .directive('microblogList', function () {
        return {
            restrict: 'A',
            scope   : {
                bloglist  : '=',
                updatecall : '=',
                followUser: '='
            },
            replace : true,
            template:
                '<ul class="microblogList">' +
                    '<li ng-repeat="microblogNode in bloglist">' +
                        '<div class="microblogAuthor">' +
                            '<div follow-star show-if="user.isLoggedIn && microblogNode.author.displayName != user.displayName" entity="microblogNode.author" mark-func="followUser" width="14" height="14"></div>' +
                            '<a href="/user/{{ microblogNode.authorGroup[0].displayName }}">{{microblogNode.authorGroup[0].displayName }}</a>' +
                        '</div>' +
                        '<div style="float:right;">' +
                            '<a ng-if="microblogNode.location != 1" href="{{ microblogNode.locationPath }}" class="location-icon location-there"></a>' +
                            '<span class="microblogDate">{{microblogNode.microblogTime*1000 | timeFromNow}}</span>' +
                        '</div>' +
                        '<br/>' +
                        '<span class="microblogText" ng-bind-html-unsafe="microblogNode.microblogText"></span>' +
                    '</li>' +
                    '<li ng-show="bloglist.length % 20 == 0 && bloglist.length > 0">' +
                        '<a ng-click="updatecall()" data-i18n="_loadMoreMicroblogging_"></a>' +
                    '</li>' +
                    '<li ng-show="bloglist.length == 0">' +
                        '<span class="tipp" data-i18n="_noMicroblogging_"></span>' +
                    '</li>' +
                '</ul>',
            controller: function ($scope, $element, User) {
                $scope.user = User;
            }
        }
    });


findecoApp.directive('match', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            match: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch(function () {
                var modelValue = ctrl.$modelValue || ctrl.$$invalidModelValue;
                return (ctrl.$pristine && angular.isUndefined(modelValue)) || scope.match === modelValue;
            }, function (currentValue) {
                ctrl.$setValidity('match', currentValue);
            });
        }
    };
});






