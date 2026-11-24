import { Vec3 } from "cc"





export const BundleNames = {
    resources: 'resources',
}

export const soundPath = {
    bgm:            { path: 'audio/bgm',            bundle: BundleNames.resources },
    boss:           { path: 'audio/boss',           bundle: BundleNames.resources },
    max:            { path: 'audio/max',            bundle: BundleNames.resources },
    diu:            { path: 'audio/diu',            bundle: BundleNames.resources },
    diuguoli:       { path: 'audio/diuguoli',       bundle: BundleNames.resources },
    unlockMouse:    { path: 'audio/unlockMouse',    bundle: BundleNames.resources },
    xichengqi:      { path: 'audio/xichengqi',      bundle: BundleNames.resources },
    opendoor:       { path: 'audio/opendoor',       bundle: BundleNames.resources },
    shiqu:          { path: 'audio/shiqu',          bundle: BundleNames.resources },
    mouse:          { path: 'audio/mouse',          bundle: BundleNames.resources },
    mouseDie:       { path: 'audio/mouseDie',       bundle: BundleNames.resources },
    mouseHunmmer:   { path: 'audio/mouseHunmmer',   bundle: BundleNames.resources },
    unlock:         { path: 'audio/unlock',         bundle: BundleNames.resources },
    clickBtn:       { path: 'audio/clickBtn',       bundle: BundleNames.resources },
    coin:           { path: 'audio/coin',           bundle: BundleNames.resources },
    gunfire:        { path: 'audio/gunfire',        bundle: BundleNames.resources },
};

export const isDebugMode = false;


export const cameraConfigs = {
    "horizontal": {
        "fov": 25,
        "position": new Vec3(10.309, 24.719, 9.59),
        "rotation": new Vec3(-44.404, 24.332, -5.803)
    },
    "vertical": {
        "fov": 35,
        "position": new Vec3(10.309, 24.719, 9.59),
        "rotation": new Vec3(-44.404, 24.332, -5.803)
    }
}

export enum enemyType {
    bear = 0,
    stone = 1,
}

