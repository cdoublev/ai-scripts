//@strict on
//@target Illustrator

const localized = {
    emptySelection: {
        en: 'Select path',
        fr: 'Choisissez un tracé',
    },
    error: {
        en: 'Error',
        fr: 'Erreur',
    },
    itemType: {
        en: 'Unsupported item of type %1',
        fr: 'Élément non supporté de type %1',
    },
}

/**
 * showProperties :: PathItem -> void
 */
function showProperties(item) {

    var infos = []

    infos.push('name: ' + item.name)
    infos.push('total length: ' + item.length + ' pt')
    infos.push('area: ' + item.area + ' pt')
    infos.push('bounds: ' + item.controlBounds.join(', '))
    infos.push('is closed: ' + item.closed)
    infos.push('is clipping: ' + item.clipping)

    alert(infos.join('\n'))
}

if (documents.length > 0 && selection.length > 0) {
    if (selection[0].typename === 'PathItem') {
        showProperties(selection[0])
    } else {
        alert(selection[0].name)
        alert(localize(localized.itemType, selection[0].typename), localize(localized.error))
    }
} else {
    alert(localize(localized.emptySelection), localize(localized.error))
}
