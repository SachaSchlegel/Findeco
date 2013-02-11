/* Findeco is dually licensed under GPLv3 or later and MPLv2.
#
################################################################################
# Copyright (c) 2012 Johannes Merkert <jonny@pinae.net>,
# Klaus Greff <klaus.greff@gmx.net>
# This file is part of Findeco.
#
# Findeco is free software; you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation; either version 3 of the License, or (at your option) any later
# version.
#
# Findeco is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
# A PARTICULAR PURPOSE. See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along with
# Findeco. If not, see <http://www.gnu.org/licenses/>.
################################################################################
#
################################################################################
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
##############################################################################*/

function ClassParser() {}

var Parser = new ClassParser();

var h1Start = /^\s*=([^=]+)=*\s*(.*)$/;
var generalH = /={2,6}([^=]+)=*[^=]/;
var invalidSymbols = /[^\w\-_\s]+/g;

function getHeadingMatcher(level) {
    var s;
    if ((level < 7) && (level > 0)) {
        s = String(level);
    } else {
        if (level == 0) {
            s = "1, 6";
        } else {
            return false;
            /* raise ValueError("level must be between 1 and 6 or 0, but was %d."%level) */
        }
    }
    return "^\s*={"+s+"}([^=§]+)(?:§\s*([^=§\s][^=§]*))?=*\s*(.*)$";
}

function removeUnallowedChars(s) {
    return s.replace(invalidSymbols, '');
}

function removeAndCompressWhitespaces(s) {
    var words = s.split(" ");
    var compressed = "";
    for (var i = 0; i < words.length; i++) {
        compressed += "_" + words[i];
    }
    return compressed.substring(1)
}

function substituteUmlauts(s) {
    var umlauts = ['ä','ö','ü','ß','Ä','Ö','Ü','ẞ'];
    var substuitutes = ['ae','oe','ue','ss','Ae','Oe','Ue','SS'];
    for (var i = 0; i < umlauts.length; i++) {
        s = s.replace(umlauts[i],substuitutes[i]);
    }
    return s;
}

function turnIntoValidShortTitle(title, shortTitleSet, maxLength) {
    var st = substituteUmlauts(title);
    //st = strip_accents(st);
    st = removeUnallowedChars(st);
    st = removeAndCompressWhitespaces(st);
    st = st.substring(0, maxLength);
    if (st.length <= 0) {
        var i = 0;
        while (true) {
            i += 1;
            var new_st = String(i);
            var not_found = true;
            for (var j = 0; j < shortTitleSet.length; j++) {
                if (new_st == shortTitleSet[j]) {
                    not_found = false;
                }
            }
            if (not_found) {
                return new_st;
            }
        }
    }
    not_found = true;
    for (j = 0; j < shortTitleSet.length; j++) {
        if (st == shortTitleSet[j]) {
            not_found = false;
        }
    }
    if (not_found) {
        return st;
    } else {
        i = 0;
        while (true) {
            i++;
            var suffix = String(i);
            new_st = st.substring(0, maxLength - suffix.length) + suffix;
            not_found = true;
            for (j = 0; j < shortTitleSet.length; j++) {
                if (new_st == shortTitleSet[j]) {
                    not_found = false;
                }
            }
            if (not_found) {
                return new_st
            }
        }
    }
}

function testLevel(s, l) {
    var levelCounter = 0;
    var heading = false;
    var afterEnd = false;
    for (var i = 0; i < s.length; i++) {
        if (s[i] == "=") {
            levelCounter++;
            if (!(heading) && (levelCounter == l) && ((i+1 >= s.length) || (s[i+1] != "="))) {
                return true;
            }
            afterEnd = true;
        } else {
            levelCounter = 0;
            if (afterEnd) {
                heading = !heading;
                afterEnd = false;
            }
        }
    }
    return false;
}

function getLevel(s) {
    for (var i = 2; i<7; i++) {
        if (testLevel(s, i)) {
            return i;
        }
    }
    return 0;
}

function splitAtHeading(s, level) {
    var before = 0;
    var levelCounter = 0;
    var heading = false;
    var afterEnd = false;
    for (var i = 0; i < s.length; i++) {
        if (s[i] != "=") {
            before = i;
            levelCounter = 0;
            if (afterEnd) {
                heading = !heading;
                afterEnd = false;
            }
        } else {
            afterEnd = true;
            levelCounter++;
            if (!(heading) && (levelCounter == level) && ((i+1 >= s.length) || (s[i+1] != "="))) {
                return [s.substring(0,before), s.substring(before)];
            }
        }
    }
    return [s, ""];
}

function parseStructure(s, shortTitle) {
    var m = h1Start.exec(s);
    if (h1Start.test(s) && (m.length > 2)) {
        var title = m[1];
        title = title.split("§")[0]; // silently remove attempt to set short_title in H1
        s = m[2];
    } else {
        return "Must start with H1 heading to set title";
        /*raise InvalidWikiStructure('Must start with H1 heading to set title')*/
    }
    title = title.replace(/^\s+|\s+$/g, ''); /* strip in javascript */
    title = title.substring(0, 150);
    var node = {};
    node['title'] = title.replace(/^\s+|\s+$/g, ''); /* strip in javascript */
    node['short_title'] = shortTitle;
    node['children'] = [];

    /* do we need a StructureNode or will a TextNode do? */
    if (!(generalH.test(s))) {
        /* Text Node */
        node['text'] = s.replace(/^\s+|\s+$/g, ''); /* strip in javascript */
        return node
    } /* else: StructureNode */

    /* determine used header depth: */
    var level = getLevel(s);

    /* leading text is used to set text of structure node */
    var splitDoc = splitAtHeading(s, level);
    node['text'] = splitDoc[0].replace(/^\s+|\s+$/g, '');
    s = splitDoc[1];

    /* parsing sections now */
    m = new RegExp(getHeadingMatcher(level));
    while (m.test(s.replace(/^\s+|\s+$/g, ''))) {
        splitDoc = m.exec(s.replace(/^\s+|\s+$/g, ''));
        title = splitDoc[1].replace(/^\s+|\s+$/g, '');
        if (splitDoc[2] == undefined) {
            shortTitle = turnIntoValidShortTitle(title, [], 20);
        } else {
            shortTitle = turnIntoValidShortTitle(splitDoc[2].replace(/^\s+|\s+$/g, ''), [], 20);
        }

        splitDoc = splitAtHeading(splitDoc[3],level);
        node['children'].push(parseStructure("= " + title + " =\n" + splitDoc[0].replace(/^\s+|\s+$/g, ''), shortTitle));
        s = splitDoc[1];
    }
    return node;
}

ClassParser.prototype.parse = function(text){
    return "<p>Not Implemented!</p>";
};

