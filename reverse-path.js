//@strict on
//@target Illustrator

const localized = {
    emptySelection: {
        en: 'Select item(s) to reverse',
        fr: 'Choisissez des éléments à inverser',
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
 * reversePoints :: [PathPoint] -> void
 */
function reversePoints(points) {

    const pointsLength = points.length
    const middlePointIndex = pointsLength / 2

    for (var i = 0; i < middlePointIndex; i++) {

        var point = points[i]
        var prevPoint = points[pointsLength - i - 1]

        var anchor = prevPoint.anchor
        var left = prevPoint.leftDirection
        var type = prevPoint.pointType
        var right = prevPoint.rightDirection

        prevPoint.anchor = point.anchor
        prevPoint.leftDirection = point.rightDirection
        prevPoint.pointType = point.pointType
        prevPoint.rightDirection = point.leftDirection
        point.anchor = anchor
        point.leftDirection = right
        point.pointType = type
        point.rightDirection = left
    }
}

/**
 * reverseSelection :: Selection -> void
 *
 * Selection => [CompoundPathItem|GroupItem|PathItem|TextFrame]
 *
 * Memo:
 * - all PathPoint related items have selectedPathPoints and pathPoints
 * - PathItem and TextPath have selectedPathPoints
 * - TextFrame(Item) has textPath
 * - GroupItem has pathItems and compoundPathItems
 * - CompountPathItem, Document, and Layer have pathItems
 * - Document and Layer can't be selected
 */
function reverseSelection(selection) {

    const selectionLength = selection.length

    for (var i = 0; i < selectionLength; i++) {

        var item = selection[i]

        switch (item.typename) {
            case 'CompoundPathItem':
                reverseSelection(item.pathItems)
                break;
            case 'GroupItem':
                reverseSelection(item.compoundPathItems)
                reverseSelection(item.pathItems)
                break;
            case 'PathItem':
                reversePoints(item.selectedPathPoints)
                break;
            case 'TextFrame':
                reversePoints(item.textPath.selectedPathPoints)
                break;
            default:
                alert(localize(localized.itemType, item.typename), localize(localized.error))
                break;
        }
    }
}

if (documents.length && selection.length) {
    reverseSelection(selection)
} else {
    alert(localize(localized.emptySelection), localize(localized.error))
}
