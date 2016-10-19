
const path = require('path');
const fs = require('fs');

///gsettings get org.gnome.desktop.interface icon-theme
const icon_path = "/usr/share/icons"

var logging = false;

module.exports = function(l) {

    if(l != undefined)
    logging = l;

    return {
        //file: file_icon,
        find: find_icon,
        themes: get_themes
    }
}

function find_icon (theme, icon){
    var iconset_path = path.join(icon_path, theme);
    var files = fs.readdirSync(iconset_path);
    if(logging)
        console.log("theme path " + iconset_path);

    var dirs = [];
    files.forEach(function(file){
        var filepath = path.join(iconset_path, file)
        if(fs.lstatSync(filepath).isDirectory() && file.indexOf('cursors') <= -1){
            dirs.push(path.parse(filepath).name);
        }
    });
    var found_icons = {};
    mainloop:
        for(dir of dirs) {
            var iconset_path_res = path.join(iconset_path, dir);
            if(logging)
                console.log("    " + dir);
            var icon_types = fs.readdirSync(iconset_path_res);
            //icons[path.parse(dir).name] = {};
            for(file of icon_types){
                var icon_type_path = path.join(iconset_path_res, file);
                if(logging)
                    console.log("        " + icon_type_path);
                var icons = fs.readdirSync(icon_type_path);
                for(iconpath of icons) {
                    var the_icon_path = path.join(icon_type_path, iconpath);
                    var p = path.parse(the_icon_path);
                    if(logging){
                        console.log("            " + the_icon_path);
                        console.log("            " + p.name + '==' + icon);
                    }
                    if(p.name == icon){

                        found_icons[dir] = {path: the_icon_path, name: p.name, ext: p.ext, type: file};
                        //return {path: the_icon_path, name: p.name, res: dir, type: file};
                        //break mainloop;
                    }
                }
            }
        }

    return found_icons;

}

function get_themes (){
    var themes = [];

    var files = fs.readdirSync(icon_path);

    files.forEach(function(file){
        var filepath = path.join(icon_path, file)
        if(fs.lstatSync(filepath).isDirectory()){
            themes.push({name: file, path: filepath});
        }
    });
    return themes;
}

function file_icon (filepath){
    return find_icon

}