
class Control {
    addEventListener() {}
    dispatchEvent() {}
    hide() {}
    notify() {}
    removeEventListener() {}
    show() {}
    toString() {}
    valueOf() {}
}
class ListControl extends Control {
    items = []
    add(type, text) {
        if (type === 'item') {
            const item = new ListItem
            this.items.push([text, item])
            return item
        }
        return null
    }
    find(text) {
        return this.items.find(([id]) => id === text)?.[1]
    }
    remove() {}
    removeAll() {}
    revealItem() {}
}
class Container extends Control {
    children = []
    add(type, ...options) {
        let id
        switch (type) {
            case 'group':
                id = options[1]?.name
                break
            case 'progressbar':
            case 'slider':
                id = options[4]?.name
                break
            case 'scrollbar':
                id = options[7]?.name
                break
            default:
                id = options[2]?.name
                break
        }
        id = id ?? this.children.length - 1

        const objectClass = {
            'button': Button,
            'checkbox': Checkbox,
            'dropdownlist': DropDownList,
            'edittext': EditText,
            'flashplayer': FlashPlayer,
            'group': Group,
            'iconbutton': IconButton,
            'image': Image,
            'item': ListItem,
            'listbox': ListBox,
            'panel': Panel,
            'progressbar': Progressbar,
            'radiobutton': RadioButton,
            'scrollbar': Scrollbar,
            'slider': Slider,
            'statictext': StaticText,
            'tab': Tab,
            'tabbedpanel': TabbedPanel,
            'treeview': TreeView,
        }[type]

        if (objectClass) {
            const object = new objectClass(options)
            this.children.push([id, object])
            return object
        }
        return null
    }
    addEventListener() {}
    center() {}
    close() {}
    dispatchEvent() {}
    findElement(name) {
        return this.children.find(([id]) => id === name)?.[1]
    }
    hide() {}
    notify() {}
    remove() {}
    removeEventListener() {}
    show() {}
    update() {}
}
class Button extends Control {}
class Checkbox extends Control {}
class DropDownList extends ListControl {}
class EditText extends Control {}
class FlashPlayer extends Control {}
class Group extends Container {}
class IconButton extends Control {}
class Image extends Control {}
class ListItem extends Control {}
class ListBox extends ListControl {}
class Panel extends Container {}
class Progressbar extends Control {}
class RadioButton extends Control {}
class Scrollbar extends Control {}
class Slider extends Control {}
class StaticText extends Control {}
class Tab extends Container {}
class TabbedPanel extends Container {}
class TreeView extends ListControl {}

globalThis.Window = class Window extends Container {
    constructor(type, title, bounds, props) {
        super(type, title, bounds, props)
        Window.instances.push(this)
    }
}
Window.instances = []

globalThis.localize = ({ en }, ...args) =>
    args.reduce((localized, arg, index) => localized.replaceAll(`%${index + 1}`, arg), en)
