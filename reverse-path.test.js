
const PointType = window.PointType = {
    CORNER: 1,
    SMOOTH: 2,
}
const path = {
    selectedPathPoints: [],
    typename: 'PathItem',
}
const alert = window.alert = jest.fn()

beforeEach(() => {
    window.documents = [document]
    window.selection = [path]
    jest.resetModules()
})

it('should alert if no document is open or no item is selected', () => {

    window.documents = []
    window.selection = []

    require('./reverse-path')

    expect(alert).toHaveBeenCalledWith('Select item(s) to reverse', 'Error')
})
it('should alert if a selected item type is not supported', () => {

    const item = { typename: 'unknown' }
    window.selection = [item]

    require('./reverse-path')

    expect(alert).toHaveBeenCalledWith('Unsupported item of type unknown', 'Error')
})
it('should reverse selected path', () => {

    const from = {
        anchor: [0, 0],
        leftDirection: [-5, 5],
        pointType: PointType.SMOOTH,
        rightDirection: [5, -5],
    }
    const to = {
        anchor: [10, 0],
        leftDirection: [5, -5],
        pointType: PointType.SMOOTH,
        rightDirection: [15, 5],
    }
    path.selectedPathPoints = [from, to]

    require('./reverse-path')

    expect(path.selectedPathPoints).toEqual([
        {
            anchor: [10, 0],
            leftDirection: [15, 5],
            pointType: PointType.SMOOTH,
            rightDirection: [5, -5],
        },
        {
            anchor: [0, 0],
            leftDirection: [5, -5],
            pointType: PointType.SMOOTH,
            rightDirection: [-5, 5],
        },
    ])
})
