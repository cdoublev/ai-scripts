//@strict on
//@target Illustrator

const localized = {
    alert: {
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
    },
    dialog: {
        precision: {
            en: 'Precision: ',
            fr: 'Précision: ',
        },
        title: {
            en: 'Round path items',
            fr: "Arrondir le tracé d'éléments",
        },
    },
}

/**
 * getAngle :: Point -> Number
 */
function getAngle(point) {

    var x1 = point.lx - point.ax
    var y1 = point.ly - point.ay
    var x2 = point.rx - point.ax
    var y2 = point.ry - point.ay

    return Math.atan2((y2 * x1) - (x2 * y1), (x2 * x1) + (y2 * y1)) * 180 / Math.PI
}

/**
 * isSmoothPoint :: Point -> Boolean
 */
function isSmoothPoint(point, precision) {
    const angle = Math.abs(roundNumber(getAngle(point), precision))
    return angle === 0 || angle === 180
}

/**
 * roundNumber :: (Number -> Number) -> Number
 */
function roundNumber(n, precision) {
    return +n.toFixed(precision)
}

/**
 * roundPoints :: ([PathPoint] -> Number) -> void
 */
function roundPoints(points, precision) {

    const pointsLength = points.length

    for (var i = 0; i < pointsLength; i++) {

        var point = points[i]

        if (point.selected !== PathPointSelection.ANCHORPOINT) {
            continue;
        }

        var prev = {
            lx: point.leftDirection[0],
            ly: point.leftDirection[1],
            rx: point.rightDirection[0],
            ry: point.rightDirection[1],
            ax: point.anchor[0],
            ay: point.anchor[1],
        }
        var ax = roundNumber(point.anchor[0], precision)
        var ay = roundNumber(point.anchor[1], precision)
        var moveX = ax - prev.ax
        var moveY = ay - prev.ay
        var lx = roundNumber(point.leftDirection[0] + moveX, precision)
        var ly = roundNumber(point.leftDirection[1] + moveY, precision)
        var rx = roundNumber(point.rightDirection[0] + moveX, precision)
        var ry = roundNumber(point.rightDirection[1] + moveY, precision)

        point.anchor = [ax, ay]
        point.leftDirection = [lx, ly]

        if ((lx === ax && ly === ay) || (rx === ax && ry === ay)) {

            point.pointType = PointType.SMOOTH

        } else if (isSmoothPoint(prev, precision)) {

            // Angle at leftDirection from [ax, ly] to anchor
            var angle = Math.atan2(ay - ly, ax - lx)
            // (Previous) distance between anchor and rightDirection
            var distance = Math.sqrt(Math.pow(prev.rx - prev.ax, 2) + Math.pow(prev.ry - prev.ay, 2))

            // Compute rx using distance and angle
            rx = roundNumber(ax + (distance * Math.cos(angle)), precision)
            // Compute ry using rx and slope
            if (ax !== lx) {
                // Slope from leftDirection to anchor
                var slope = (ay - ly) / (ax - lx)
                ry = ay + (slope * (rx - ax))
            }

            point.pointType = PointType.SMOOTH
        }

        point.rightDirection = [rx, ry]
    }
}

/**
 * roundSelection :: (Selection -> Number) -> void
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
function roundSelection(selection, precision) {

    const selectionLength = selection.length

    for (var i = 0; i < selectionLength; i++) {

        var item = selection[i]

        switch (item.typename) {
            case 'CompoundPathItem':
                roundSelection(item.pathItems)
                break;
            case 'GroupItem':
                roundSelection(item.compoundPathItems)
                roundSelection(item.groupItems)
                roundSelection(item.pathItems)
                break;
            case 'PathItem':
                roundPoints(item.selectedPathPoints, precision)
                break;
            case 'TextFrame':
                roundPoints(item.textPath.selectedPathPoints, precision)
                break;
            default:
                alert(localize(localized.alert.itemType, item.typename), localize(localized.alert.error))
                break;
        }
    }
}

if (documents.length > 0 && selection.length > 0) {

    const dialog = new Window('dialog', localize(localized.dialog.title))
    const precision = dialog.add('slider', undefined, 0, 0, 7, { name: 'precision' })
    const output = dialog.add('edittext', undefined, '', { borderless: true, name: 'output', readonly: true })
    const submit = dialog.add('button', undefined, 'OK', { name: 'ok' })
    const outputPrefix = localize(localized.dialog.precision)

    output.text = outputPrefix + precision.value
    precision.onChanging = function () {
        output.text = outputPrefix + precision.value
    }
    submit.onClick = function () {
        roundSelection(selection, precision.value)
        dialog.close()
    }
    dialog.show()

} else {
    alert(localize(localized.alert.emptySelection), localize(localized.alert.error))
}
