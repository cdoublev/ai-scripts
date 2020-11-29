
const PointType = window.PointType = {
    CORNER: 1,
    SMOOTH: 2,
}
const PathPointSelection = window.PathPointSelection = {
    NOSELECTION: 0,
    ANCHORPOINT: 1,
    LEFTDIRECTION: 2,  // Applicable to the next PathPoint
    RIGHTDIRECTION: 3, // Applicable to the previous PathPoint
    LEFTRIGHTPOINT: 4, // Can't reproduce this state...

}
const item = {
    locked: false,
    selectedPathPoints: [],
    typename: 'PathItem',
}
const alert = window.alert = jest.fn()

beforeEach(() => {
    window.documents = [document]
    window.selection = [item]
    item.selectedPathPoints = []
    jest.resetModules()
})

it('should alert if no document is open or no item is selected', () => {

    window.documents = []
    window.selection = []

    require('./round-path')

    expect(alert).toHaveBeenCalledWith('Select item(s) to reverse', 'Error')
})
it('should alert if a selected item type is not supported', () => {

    const item = { typename: 'unknown' }
    window.selection = [item]

    require('./round-path')

    const dialog = window.Window.instances[0]
    const submit = dialog.findElement('ok')

    submit.onClick()

    expect(alert).toHaveBeenCalledWith('Unsupported item of type unknown', 'Error')
})
it('should not round a point whose anchor is not selected', () => {

    const point = {
        anchor: [0.5, 0.5],
        leftDirection: [-0.5, 1.5],
        pointType: PointType.SMOOTH,
        rightDirection: [1.5, -0.5],
        selected: PathPointSelection.NOSELECTION,
    }

    item.selectedPathPoints = [point]

    require('./round-path')

    const dialog = window.Window.instances[0]
    const submit = dialog.findElement('ok')

    submit.onClick()

    expect(point).toEqual({
        anchor: [0.5, 0.5],
        leftDirection: [-0.5, 1.5],
        pointType: PointType.SMOOTH,
        rightDirection: [1.5, -0.5],
        selected: PathPointSelection.NOSELECTION,
    })
})
it('should round the anchor/left/right parameters of a smooth point (where left === anchor)', () => {

    const point = {
        anchor: [0.5, 0.5],
        leftDirection: [0.5, 0.5],
        pointType: PointType.SMOOTH,
        rightDirection: [1, 1],
        selected: PathPointSelection.ANCHORPOINT,
    }

    item.selectedPathPoints = [point]

    require('./round-path')

    const dialog = window.Window.instances[0]
    const submit = dialog.findElement('ok')

    submit.onClick()

    expect(point).toEqual({
        anchor: [1, 1],
        leftDirection: [1, 1],
        pointType: PointType.SMOOTH,
        rightDirection: [2, 2],
        selected: PathPointSelection.ANCHORPOINT,
    })
})
it('should round the anchor/left/right parameters of a smooth point (where right === anchor)', () => {

    const point = {
        anchor: [0.5, 0.5],
        leftDirection: [1, 1],
        pointType: PointType.SMOOTH,
        rightDirection: [0.5, 0.5],
        selected: PathPointSelection.ANCHORPOINT,
    }

    item.selectedPathPoints = [point]

    require('./round-path')

    const dialog = window.Window.instances[0]
    const submit = dialog.findElement('ok')

    submit.onClick()

    expect(point).toEqual({
        anchor: [1, 1],
        leftDirection: [2, 2],
        pointType: PointType.SMOOTH,
        rightDirection: [1, 1],
        selected: PathPointSelection.ANCHORPOINT,
    })
})
it('should round the anchor/left/right parameters of a smooth point (where left.x === anchor.x === right.x)', () => {

    const point = {
        anchor: [0, 0],
        leftDirection: [0, -0.5],
        pointType: PointType.SMOOTH,
        rightDirection: [0, 1.5],
        selected: PathPointSelection.ANCHORPOINT,
    }

    item.selectedPathPoints = [point]

    require('./round-path')

    const dialog = window.Window.instances[0]
    const submit = dialog.findElement('ok')

    submit.onClick()

    expect(point).toEqual({
        anchor: [0, 0],
        leftDirection: [0, -1],
        pointType: PointType.SMOOTH,
        rightDirection: [0, 2],
        selected: PathPointSelection.ANCHORPOINT,
    })
})
it('should round the anchor/left/right parameters of a smooth point (where left.y === anchor.y === right.y)', () => {

    const point = {
        anchor: [0, 0],
        leftDirection: [-0.5, 0],
        pointType: PointType.SMOOTH,
        rightDirection: [1.5, 0],
        selected: PathPointSelection.ANCHORPOINT,
    }

    item.selectedPathPoints = [point]

    require('./round-path')

    const dialog = window.Window.instances[0]
    const submit = dialog.findElement('ok')

    submit.onClick()

    expect(point).toEqual({
        anchor: [0, 0],
        leftDirection: [-1, 0],
        pointType: PointType.SMOOTH,
        rightDirection: [2, 0],
        selected: PathPointSelection.ANCHORPOINT,
    })
})
it('should round the anchor/left/right parameters of a smooth point', () => {

    const point = {
        anchor: [0.5, 0.5],           // rounded to [1, 1] (move [0.5, 0.5])
        leftDirection: [-1.75, 1.75], // moved to [-1.25, 2.25] then rounded to [-1, 2]
        pointType: PointType.SMOOTH,
        rightDirection: [5, -2],      // moved to [5.5, ry] -> rounded to [6, ry]
        selected: PathPointSelection.ANCHORPOINT,
    }

    item.selectedPathPoints = [point]

    require('./round-path')

    const dialog = window.Window.instances[0]
    const submit = dialog.findElement('ok')

    submit.onClick()

    expect(point).toEqual({
        anchor: [1, 1],
        leftDirection: [-1, 2],
        pointType: PointType.SMOOTH,
        rightDirection: [6, -1.5],
        selected: PathPointSelection.ANCHORPOINT,
    })
})
it('should round the right parameter of a smooth point (where left.x === anchor.x) ', () => {

    const point = {
        anchor: [0, 0],
        leftDirection: [0, -2],
        pointType: PointType.SMOOTH,
        rightDirection: [0, 1.5],
        selected: PathPointSelection.ANCHORPOINT,
    }

    item.selectedPathPoints = [point]

    require('./round-path')

    const dialog = window.Window.instances[0]
    const submit = dialog.findElement('ok')

    submit.onClick()

    expect(point).toEqual({
        anchor: [0, 0],
        leftDirection: [0, -2],
        pointType: PointType.SMOOTH,
        rightDirection: [0, 2],
        selected: PathPointSelection.ANCHORPOINT,
    })
})
it('should round the right parameter of a smooth point (where left.y === anchor.y) ', () => {

    const point = {
        anchor: [0, 0],
        leftDirection: [-2, 0],
        pointType: PointType.SMOOTH,
        rightDirection: [1.5, 0],
        selected: PathPointSelection.ANCHORPOINT,
    }

    item.selectedPathPoints = [point]

    require('./round-path')

    const dialog = window.Window.instances[0]
    const submit = dialog.findElement('ok')

    submit.onClick()

    expect(point).toEqual({
        anchor: [0, 0],
        leftDirection: [-2, 0],
        pointType: PointType.SMOOTH,
        rightDirection: [2, 0],
        selected: PathPointSelection.ANCHORPOINT,
    })
})
it('should convert a corner point that is almost a smooth point', () => {

    const point = {
        anchor: [0.5, 0.5],
        leftDirection: [-1.7, 1.7],
        pointType: PointType.CORNER,
        rightDirection: [5, -2],
        selected: PathPointSelection.ANCHORPOINT,
    }

    item.selectedPathPoints = [point]

    require('./round-path')

    const dialog = window.Window.instances[0]
    const submit = dialog.findElement('ok')

    submit.onClick()

    expect(point).toEqual({
        anchor: [1, 1],
        leftDirection: [-1, 2],
        pointType: PointType.SMOOTH,
        rightDirection: [6, -1.5],
        selected: PathPointSelection.ANCHORPOINT,
    })
})
