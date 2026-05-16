const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./building6.db', (err) => {
    if (err) console.error('Error opening database:', err);
    else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Floor heights
const FLOOR_Y = [0, 14, 28, 42, 56, 70];
const FLOOR_NAMES = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor', 'Fifth Floor'];

const ROOM_TYPES = {
    CLASSROOM: 'classroom',
    LAB: 'lab',
    OFFICE: 'office',
    CORRIDOR: 'corridor',
    STAIR_LEFT: 'stair_left',
    STAIR_RIGHT: 'stair_right',
    STAIR_MID: 'stair_mid',
    LIFT_LEFT: 'lift_left',
    LIFT_RIGHT: 'lift_right',
    TOILET: 'toilet',
    LIBRARY: 'library'
};

// ----------------------------------------------------------------------
//  Room generation for a given floor
// ----------------------------------------------------------------------
function generateFloorRooms(floorIdx) {
    const floorDigit = floorIdx;         // 0,1,2,3,4,5
    const building = 6;
    // const prefix = `${building}${floorDigit}`;
    if (floorIdx === 0) {
        // --- Left side: Reading Hall (half width) ---
        const readingHall = {
            id: '6005', name: 'Reading Hall [6005 RH]', type: ROOM_TYPES.CLASSROOM,
            x: -5, z: 0, w: 12, d: 40,
            isCorridor: false, isStair: false, isLift: false
        };

        // --- Left lift (top row) ---
        const leftLift = {
            id: `LL0`, name: 'Left Lift', type: ROOM_TYPES.LIFT_LEFT,
            x: 7.5, z: 0, w: 4.5, d: 12,
            isCorridor: false, isStair: false, isLift: true, side: 'left'
        };

        // --- Central Lab (top row, expanded) ---
        const centralLab = {
            id: '6006', name: 'Central Library [6006LI]', type: ROOM_TYPES.LIBRARY,
            x: 12.5, z: 0, w: 22.3, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };

        // --- Changing rooms (top row) aligned above the middle staircase ---
        const boysChanging = {
            id: '6007', name: 'Boys Changing Room [6007]', type: ROOM_TYPES.TOILET,
            x: 35, z: 0, w: 4.8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const girlsChanging = {
            id: '6008', name: 'Girls Changing Room [6008]', type: ROOM_TYPES.TOILET,
            x: 40, z: 0, w: 4.8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        // --- Algorithm Labs & Server (top row, right side) ---
        const algLab1 = {
            id: '6009', name: 'Algorithm Lab-1 [6009L]', type: ROOM_TYPES.LAB,
            x: 45, z: 0, w: 7.8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const algLab2 = {
            id: '6010', name: 'Algorithm Lab-2 [6010LA]', type: ROOM_TYPES.LAB,
            x: 53, z: 0, w: 7.8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const serverRoom = {
            id: '6011', name: 'Server Room [6011 SR]', type: ROOM_TYPES.LAB,
            x: 61, z: 0, w: 7.8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const rightLift = {
            id: `LR0`, name: 'Right Lift', type: ROOM_TYPES.LIFT_RIGHT,
            x: 69, z: 0, w: 4.8, d: 12,
            isCorridor: false, isStair: false, isLift: true, side: 'right'
        };
        // --- Bottom row: Staircases, Library, Reference, CILL, IEN, etc. ---
        const leftStair = {
            id: `SL0`, name: 'Left Staircase', type: ROOM_TYPES.STAIR_LEFT,
            x: 7.5, z: 28, w: 4.5, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'left'
        };
        const digitalLibrary = {
            id: '6004', name: 'Digital Library [6004DI]', type: ROOM_TYPES.LIBRARY,
            x: 12.5, z: 28, w: 10, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const referenceSection = {
            id: '6003', name: 'Reference Section [6003RS]', type: ROOM_TYPES.LIBRARY,
            x: 22.5, z: 28, w: 12.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const middleStair = {
            id: `SM0`, name: 'Middle Staircase', type: ROOM_TYPES.STAIR_MID,
            x: 35, z: 28, w: 10, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'mid'
        };
        const cillOffice = {
            id: '6002', name: 'CILL Office [6002FC]', type: ROOM_TYPES.OFFICE,
            x: 45.5, z: 28, w: 11.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const ienLab = {
            id: '6001', name: 'IEN Lab [6001LA]', type: ROOM_TYPES.LAB,
            x: 57, z: 28, w: 11.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const rightStair = {
            id: `SR0`, name: 'Right Staircase', type: ROOM_TYPES.STAIR_RIGHT,
            x: 69, z: 28, w: 4.8, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'right'
        };
        // --- NEW: Three labs stacked vertically on the far right ---
        // Top lab (z=0)
        const edLab = {
            id: '6012', name: 'Electronic Design & Project Lab [6012LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 0, w: 12, d: 13,
            isCorridor: false, isStair: false, isLift: false
        };
        // Middle lab (z=14) – placed in the former corridor area
        const dspLab = {
            id: '6013', name: 'Digital Signal Processing [6013LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 13, w: 12, d: 13,
            isCorridor: false, isStair: false, isLift: false
        };
        // Bottom lab (z=28)
        const embeddedLab = {
            id: '6014', name: 'Embedded Systems [6014LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 26, w: 12, d: 14,
            isCorridor: false, isStair: false, isLift: false
        };

        // Corridor segments (5 pieces)
        const corridorSegments = [
            { id: `COR0_A`, name: 'Corridor A', type: ROOM_TYPES.CORRIDOR, x: 8,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR0_B`, name: 'Corridor B', type: ROOM_TYPES.CORRIDOR, x: 21,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR0_C`, name: 'Corridor C', type: ROOM_TYPES.CORRIDOR, x: 34,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR0_D`, name: 'Corridor D', type: ROOM_TYPES.CORRIDOR, x: 47,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR0_E`, name: 'Corridor E', type: ROOM_TYPES.CORRIDOR, x: 60,  z: 12, w: 13, d: 16, isCorridor: true }
        ];

        // Combine all rooms
        const allRooms = [
            readingHall,
            leftLift, centralLab, boysChanging, girlsChanging,
            algLab1, algLab2, serverRoom, rightLift, edLab,
            leftStair, digitalLibrary, referenceSection, middleStair,
            cillOffice, ienLab, rightStair,
            dspLab, embeddedLab,
            ...corridorSegments
        ];

        return allRooms.map(r => ({
            id: r.id,
            name: r.name,
            floor: floorIdx,
            type: r.type,
            x: r.x,
            z: r.z,
            w: r.w,
            d: r.d,
            center_x: r.x + r.w/2,
            center_z: r.z + r.d/2,
            center_y: FLOOR_Y[floorIdx],
            is_corridor: r.isCorridor ? 1 : 0,
            is_stair: r.isStair ? 1 : 0,
            is_lift: r.isLift ? 1 : 0,
            side: r.side || null
        }));
    }

    if (floorIdx === 1) {
        // --- Left side: vertical stack of four rooms ---
        const room6108 = {
            id: '6108', name: 'Faculty Cabin [6108FC]', type: ROOM_TYPES.OFFICE,
            x: -5, z: 0, w: 12, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6107 = {
            id: '6107', name: 'PG Research Lab [6107LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 10, w: 12, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6106 = {
            id: '6106', name: 'PhD Research Lab [6106LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 20, w: 12, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6105 = {
            id: '6105', name: 'PG Lab [6105LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 30, w: 12, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };

        // --- Left lift and left staircase (same positions as ground floor) ---
        const leftLift = {
            id: `LL1`, name: 'Left Lift', type: ROOM_TYPES.LIFT_LEFT,
            x: 7.5, z: 0, w: 4.5, d: 12,
            isCorridor: false, isStair: false, isLift: true, side: 'left'
        };
        const leftStair = {
            id: `SL1`, name: 'Left Staircase', type: ROOM_TYPES.STAIR_LEFT,
            x: 7.5, z: 28, w: 4.5, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'left'
        };
        const room6104 = {
            id: '6104', name: 'OOP & Spandan Healthcare Innovation Lab [6104LA]', type: ROOM_TYPES.LAB,
            x: 12.5, z: 28, w: 11, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6103 = {
            id: '6103', name: 'Class Room [6103]', type: ROOM_TYPES.CLASSROOM,
            x: 23.5, z: 28, w: 11, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        // --- Rest of the top row (right of the lift) ---
        const room6109 = {
            id: '6109', name: 'VLSI Lab [6109LA]', type: ROOM_TYPES.LAB,
            x: 12.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6110 = {
            id: '6110', name: 'VLSI Embedded System Lab [6110LA]', type: ROOM_TYPES.LAB,
            x: 20.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6111 = {
            id: '6111', name: 'Faculty Cabin [6111FC]', type: ROOM_TYPES.OFFICE,
            x: 28.5, z: 0, w: 7, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const boysToilet = {
            id: '6112', name: 'Boys Toilet [6112TB]', type: ROOM_TYPES.TOILET,
            x: 35.5, z: 0, w: 5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const girlsToilet = {
            id: '6113', name: 'Girls Toilet [6113TG]', type: ROOM_TYPES.TOILET,
            x: 40.5, z: 0, w: 5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6114 = {
            id: '6114', name: 'Dean MIS [6114]', type: ROOM_TYPES.OFFICE,
            x: 45.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6115 = {
            id: '6115', name: 'Cloud Computing Lab [6115LA]', type: ROOM_TYPES.LAB,
            x: 53.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6117 = {
            id: '6117', name: 'HOD of Computer (AIML) Department [6117FC]', type: ROOM_TYPES.OFFICE,
            x: 61.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const rightLift = {
            id: `LR1`, name: 'Right Lift', type: ROOM_TYPES.LIFT_RIGHT,
            x: 69.5, z: 0, w: 4.55, d: 12,
            isCorridor: false, isStair: false, isLift: true, side: 'right'
        };
        
        // --- Bottom row (right of the left staircase, then middle stair, then right side) ---
        const middleStair = {
            id: `SM1`, name: 'Middle Staircase', type: ROOM_TYPES.STAIR_MID,
            x: 35, z: 28, w: 10, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'mid'
        };
        const room6102 = {
            id: '6102', name: 'Class Room [6102CR]', type: ROOM_TYPES.CLASSROOM,
            x: 45.5, z: 28, w: 11.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6101 = {
            id: '6101', name: 'Data Center [6101DC]', type: ROOM_TYPES.LAB,
            x: 57, z: 28, w: 11.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const rightStair = {
            id: `SR1`, name: 'Right Staircase', type: ROOM_TYPES.STAIR_RIGHT,
            x: 69.5, z: 28, w: 4.55, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'right'
        };
        const room6118 = {
            id: '6118', name: 'System Software Dev Lab [6118LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 0, w: 12, d: 13,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6119 = {
            id: '6119', name: 'Computer Vision Lab-1 [6119LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 13, w: 12, d: 13,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6120 = {
            id: '6120', name: 'Computer Vision Lab-2 [6120LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 26, w: 12, d: 14,
            isCorridor: false, isStair: false, isLift: false
        };

        // Corridor segments (5 pieces)
        const corridorSegments = [
            { id: `COR1_A`, name: 'Corridor A', type: ROOM_TYPES.CORRIDOR, x: 8,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR1_B`, name: 'Corridor B', type: ROOM_TYPES.CORRIDOR, x: 21,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR1_C`, name: 'Corridor C', type: ROOM_TYPES.CORRIDOR, x: 34,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR1_D`, name: 'Corridor D', type: ROOM_TYPES.CORRIDOR, x: 47,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR1_E`, name: 'Corridor E', type: ROOM_TYPES.CORRIDOR, x: 60,  z: 12, w: 13, d: 16, isCorridor: true }
        ];

        // Combine all rooms
        const allRooms = [
            room6108, room6107, room6106, room6105,
            leftLift, leftStair,
            room6109, room6110, room6111, boysToilet, girlsToilet,
            room6114, room6115, room6117, rightLift, room6118, room6119,
            middleStair, room6104, room6103, room6102, room6101, rightStair, room6120,
            ...corridorSegments
        ];

        return allRooms.map(r => ({
            id: r.id, name: r.name, floor: floorIdx, type: r.type,
            x: r.x, z: r.z, w: r.w, d: r.d,
            center_x: r.x + r.w/2, center_z: r.z + r.d/2, center_y: FLOOR_Y[floorIdx],
            is_corridor: r.isCorridor ? 1 : 0,
            is_stair: r.isStair ? 1 : 0,
            is_lift: r.isLift ? 1 : 0,
            side: r.side || null
        }));
    }

    if (floorIdx === 2) {
        // --- Left side: vertical stack of four rooms ---
        const room6209 = {
            id: '6209', name: 'Information Security Lab [6209LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 0, w: 12, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6208 = {
            id: '6208', name: 'Network & Communication Lab [6208LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 10, w: 12, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6207 = {
            id: '6207', name: 'Faculty Cabin [6207FC]', type: ROOM_TYPES.OFFICE,
            x: -5, z: 20, w: 12, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6206 = {
            id: '6206', name: 'IOT Lab [6206LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 30, w: 12, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };

        // --- Left lift and left staircase (same positions as ground floor) ---
        const leftLift = {
            id: `LL2`, name: 'Left Lift', type: ROOM_TYPES.LIFT_LEFT,
            x: 7.5, z: 0, w: 4.5, d: 12,
            isCorridor: false, isStair: false, isLift: true, side: 'left'
        };
        const leftStair = {
            id: `SL2`, name: 'Left Staircase', type: ROOM_TYPES.STAIR_LEFT,
            x: 7.5, z: 28, w: 4.5, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'left'
        };
        const room6205 = {
            id: '6205', name: 'Class Room [6205CR]', type: ROOM_TYPES.CLASSROOM,
            x: 12.5, z: 28, w: 11, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6204 = {
            id: '6204', name: 'Class Room [6204CR]', type: ROOM_TYPES.CLASSROOM,
            x: 23.5, z: 28, w: 11, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        // --- Rest of the top row (right of the lift) ---
        const room6210 = {
            id: '6210', name: 'Database & Informatation Managment Lab [6210LA]', type: ROOM_TYPES.LAB,
            x: 12.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6211 = {
            id: '6211', name: 'Data Analytics Lab [6211LA]', type: ROOM_TYPES.LAB,
            x: 20.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6212 = {
            id: '6212', name: 'HOD of Computer Department [Regional] [6212FC]', type: ROOM_TYPES.OFFICE,
            x: 28.5, z: 0, w: 7, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const boysToilet = {
            id: '6213', name: 'Boys Toilet [6213TB]', type: ROOM_TYPES.TOILET,
            x: 35.5, z: 0, w: 5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const girlsToilet = {
            id: '6214', name: 'Girls Toilet [6214TG]', type: ROOM_TYPES.TOILET,
            x: 40.5, z: 0, w: 5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6215 = {
            id: '6215', name: 'ISTE Chapter [6215FC]', type: ROOM_TYPES.OFFICE,
            x: 45.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6216 = {
            id: '6216', name: 'Skill Development Lab [6216LA]', type: ROOM_TYPES.LAB,
            x: 53.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6217 = {
            id: '6217', name: 'HOD of Computer Department [6217FC]', type: ROOM_TYPES.OFFICE,
            x: 61.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const rightLift = {
            id: `LR2`, name: 'Right Lift', type: ROOM_TYPES.LIFT_RIGHT,
            x: 69.5, z: 0, w: 4.55, d: 12,
            isCorridor: false, isStair: false, isLift: true, side: 'right'
        };
        
        // --- Bottom row (right of the left staircase, then middle stair, then right side) ---
        const room6203 = {
            id: '6203', name: 'Faculty Cabin [6203FC]', type: ROOM_TYPES.OFFICE,
            x: 35, z: 28, w: 10, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };

        const room6202 = {
            id: '6202', name: 'Class Room [6202CR]', type: ROOM_TYPES.CLASSROOM,
            x: 45.5, z: 28, w: 11.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6201 = {
            id: '6201', name: 'Class Room [6201CR]', type: ROOM_TYPES.CLASSROOM,
            x: 57, z: 28, w: 11.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const rightStair = {
            id: `SR2`, name: 'Right Staircase', type: ROOM_TYPES.STAIR_RIGHT,
            x: 69.5, z: 28, w: 4.55, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'right'
        };
        const room6218 = {
            id: '6218', name: 'Hardware Lab [6218LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 0, w: 12, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6219 = {
            id: '6219', name: 'Faculty Cabin [6219FC]', type: ROOM_TYPES.OFFICE,
            x: 80.5, z: 10, w: 6, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6220 = {
            id: '6220', name: 'Department Lab [6220LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 10, w: 6, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6221 = {
            id: '6221', name: 'Project Lab-1 [6221LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 20, w: 12, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6222 = {
            id: '6222', name: 'Project Lab-2 [6222LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 30, w: 12, d: 9,
            isCorridor: false, isStair: false, isLift: false
        };
       // Corridor segments (5 pieces)
        const corridorSegments = [
            { id: `COR2_A`, name: 'Corridor A', type: ROOM_TYPES.CORRIDOR, x: 8,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR2_B`, name: 'Corridor B', type: ROOM_TYPES.CORRIDOR, x: 21,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR2_C`, name: 'Corridor C', type: ROOM_TYPES.CORRIDOR, x: 34,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR2_D`, name: 'Corridor D', type: ROOM_TYPES.CORRIDOR, x: 47,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR2_E`, name: 'Corridor E', type: ROOM_TYPES.CORRIDOR, x: 60,  z: 12, w: 13, d: 16, isCorridor: true }
        ];

        // Combine all rooms
        const allRooms = [
            room6209, room6208, room6207, room6206,
            leftLift, leftStair,
            room6205, room6210, room6211, room6212, boysToilet, girlsToilet,
            room6215, room6216, room6217, rightLift, room6218, room6219,
            room6204, room6203, room6202, room6201, rightStair, room6220,
            room6221,room6222,
            ...corridorSegments
        ];

        return allRooms.map(r => ({
            id: r.id, name: r.name, floor: floorIdx, type: r.type,
            x: r.x, z: r.z, w: r.w, d: r.d,
            center_x: r.x + r.w/2, center_z: r.z + r.d/2, center_y: FLOOR_Y[floorIdx],
            is_corridor: r.isCorridor ? 1 : 0,
            is_stair: r.isStair ? 1 : 0,
            is_lift: r.isLift ? 1 : 0,
            side: r.side || null
        }));
    }

    if (floorIdx === 3) {
        // --- Left side: vertical stack of four rooms ---
        const room6308 = {
            id: '6308', name: 'Power Electronic Lab [6308LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 0, w: 12, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6307 = {
            id: '6307', name: 'Analysis & Digital Lab[6307LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 14, w: 12, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6306 = {
            id: '6306', name: 'Communication System Lab [6306LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 28, w: 12, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        // --- Left lift and left staircase (same positions as ground floor) ---
        const leftLift = {
            id: `LL3`, name: 'Left Lift', type: ROOM_TYPES.LIFT_LEFT,
            x: 7.5, z: 0, w: 4.5, d: 12,
            isCorridor: false, isStair: false, isLift: true, side: 'left'
        };
        const leftStair = {
            id: `SL3`, name: 'Left Staircase', type: ROOM_TYPES.STAIR_LEFT,
            x: 7.5, z: 28, w: 4.5, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'left'
        };
        const room6305 = {
            id: '6305', name: 'Class Room [6305CR]', type: ROOM_TYPES.CLASSROOM,
            x: 12.5, z: 28, w: 11, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6304 = {
            id: '6304', name: 'Class Room [6304CR]', type: ROOM_TYPES.CLASSROOM,
            x: 23.5, z: 28, w: 11, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        // --- Rest of the top row (right of the lift) ---
        const room6309 = {
            id: '6309', name: 'Class Room [6309CR]', type: ROOM_TYPES.CLASSROOM,
            x: 12.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6310 = {
            id: '6310', name: 'Class Room [6310CR]', type: ROOM_TYPES.CLASSROOM,
            x: 20.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6311 = {
            id: '6311', name: 'NBA Coordinator [6311FC]', type: ROOM_TYPES.OFFICE,
            x: 28.5, z: 0, w: 7, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const boysToilet = {
            id: '6312', name: 'Boys Toilet [6312TB]', type: ROOM_TYPES.TOILET,
            x: 35.5, z: 0, w: 5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const girlsToilet = {
            id: '6313', name: 'Girls Toilet [6313TG]', type: ROOM_TYPES.TOILET,
            x: 40.5, z: 0, w: 5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6314 = {
            id: '6314', name: 'Faculty Cabin [6314FC]', type: ROOM_TYPES.OFFICE,
            x: 45.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6315 = {
            id: '6315', name: 'Robotronics Lab [6315LA]', type: ROOM_TYPES.LAB,
            x: 53.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6316 = {
            id: '6316', name: 'HOD of E&TC Department [6316FC]', type: ROOM_TYPES.OFFICE,
            x: 61.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const rightLift = {
            id: `LR3`, name: 'Right Lift', type: ROOM_TYPES.LIFT_RIGHT,
            x: 69.5, z: 0, w: 4.55, d: 12,
            isCorridor: false, isStair: false, isLift: true, side: 'right'
        };
        // --- Bottom row (right of the left staircase, then middle stair, then right side) ---
        const room6303 = {
            id: '6303', name: 'Tutorial Room [6303CR]', type: ROOM_TYPES.CLASSROOM,
            x: 35, z: 28, w: 10, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };

        const room6302 = {
            id: '6302', name: 'Class Room [6302CR]', type: ROOM_TYPES.CLASSROOM,
            x: 45.5, z: 28, w: 11.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6301 = {
            id: '6301', name: 'Class Room [6301CR]', type: ROOM_TYPES.CLASSROOM,
            x: 57, z: 28, w: 11.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const rightStair = {
            id: `SR3`, name: 'Right Staircase', type: ROOM_TYPES.STAIR_RIGHT,
            x: 69.5, z: 28, w: 4.55, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'right'
        };
        const room6317 = {
            id: '6317', name: 'Digital Electronic Lab [6317LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 0, w: 12, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6318 = {
            id: '6318', name: 'AI ML Lab [6318LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 14, w: 12, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6319 = {
            id: '6319', name: 'Electronic Development & Circuit Lab [6319LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 28, w: 12, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        // Corridor segments (5 pieces)
        const corridorSegments = [
            { id: `COR3_A`, name: 'Corridor A', type: ROOM_TYPES.CORRIDOR, x: 8,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR3_B`, name: 'Corridor B', type: ROOM_TYPES.CORRIDOR, x: 21,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR3_C`, name: 'Corridor C', type: ROOM_TYPES.CORRIDOR, x: 34,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR3_D`, name: 'Corridor D', type: ROOM_TYPES.CORRIDOR, x: 47,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR3_E`, name: 'Corridor E', type: ROOM_TYPES.CORRIDOR, x: 60,  z: 12, w: 13, d: 16, isCorridor: true }
        ];
        // Combine all rooms
        const allRooms = [
            room6308, room6307, room6306,
            leftLift, leftStair,
            room6305, room6309, room6310, room6311, boysToilet, girlsToilet,
            room6314, room6315, room6316, rightLift, room6317, room6318,
            room6304, room6303, room6302, room6301, rightStair, room6319,
            ...corridorSegments
        ];

        return allRooms.map(r => ({
            id: r.id, name: r.name, floor: floorIdx, type: r.type,
            x: r.x, z: r.z, w: r.w, d: r.d,
            center_x: r.x + r.w/2, center_z: r.z + r.d/2, center_y: FLOOR_Y[floorIdx],
            is_corridor: r.isCorridor ? 1 : 0,
            is_stair: r.isStair ? 1 : 0,
            is_lift: r.isLift ? 1 : 0,
            side: r.side || null
        }));
    }
    if (floorIdx === 4) {
        // --- Left side: vertical stack of four rooms ---
        const room6408 = {
            id: '6408', name: 'Chemestry Lab-2 [6408LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 0, w: 12, d: 19,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6407 = {
            id: '6407', name: 'Chemestry Lab-1 [6407LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 21, w: 12, d: 19,
            isCorridor: false, isStair: false, isLift: false
        };
        // --- Left lift and left staircase (same positions as ground floor) ---
        const leftLift = {
            id: `LL4`, name: 'Left Lift', type: ROOM_TYPES.LIFT_LEFT,
            x: 7.5, z: 0, w: 4.5, d: 12,
            isCorridor: false, isStair: false, isLift: true, side: 'left'
        };
        const leftStair = {
            id: `SL4`, name: 'Left Staircase', type: ROOM_TYPES.STAIR_LEFT,
            x: 7.5, z: 28, w: 4.5, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'left'
        };
        const room6406 = {
            id: '6406', name: 'Class Room [6406CR]', type: ROOM_TYPES.CLASSROOM,
            x: 12.5, z: 28, w: 11, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6405 = {
            id: '6405', name: 'Class Room [6405CR]', type: ROOM_TYPES.CLASSROOM,
            x: 23.5, z: 28, w: 11, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6404 = {
            id: '6404', name: 'Faculty Cabin [6404FC]', type: ROOM_TYPES.OFFICE,
            x: 35, z: 28, w: 6, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6403 = {
            id: '6403', name: 'Literature Library [6403LL]', type: ROOM_TYPES.LIBRARY,
            x: 41, z: 28, w: 4, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        // --- Rest of the top row (right of the lift) ---
        const room6409 = {
            id: '6409', name: 'Class Room [6409CR]', type: ROOM_TYPES.CLASSROOM,
            x: 12.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6410 = {
            id: '6410', name: 'Faculty Cabin [6410FC]', type: ROOM_TYPES.OFFICE,
            x: 20.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6411 = {
            id: '6411', name: 'TU [6411TU]', type: ROOM_TYPES.OFFICE,
            x: 28.5, z: 0, w: 7, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const boysToilet = {
            id: '6412', name: 'Boys Toilet [6412TB]', type: ROOM_TYPES.TOILET,
            x: 35.5, z: 0, w: 5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const girlsToilet = {
            id: '6413', name: 'Girls Toilet [6413TG]', type: ROOM_TYPES.TOILET,
            x: 40.5, z: 0, w: 5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6414 = {
            id: '6414', name: 'Faculty Cabin [6414FC]', type: ROOM_TYPES.OFFICE,
            x: 45.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6415 = {
            id: '6415', name: 'IOT Lab (BVoc) [6415LA]', type: ROOM_TYPES.LAB,
            x: 53.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6416 = {
            id: '6416', name: 'Class Room [6416CR]', type: ROOM_TYPES.CLASSROOM,
            x: 61.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const rightLift = {
            id: `LR4`, name: 'Right Lift', type: ROOM_TYPES.LIFT_RIGHT,
            x: 69.5, z: 0, w: 4.55, d: 12,
            isCorridor: false, isStair: false, isLift: true, side: 'right'
        };
        
        // --- Bottom row (right of the left staircase, then middle stair, then right side) ---
        const room6402 = {
            id: '6402', name: 'Class Room [6402CR]', type: ROOM_TYPES.CLASSROOM,
            x: 45.5, z: 28, w: 11.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6401 = {
            id: '6401', name: 'Class Room [6401CR]', type: ROOM_TYPES.CLASSROOM,
            x: 57, z: 28, w: 11.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const rightStair = {
            id: `SR4`, name: 'Right Staircase', type: ROOM_TYPES.STAIR_RIGHT,
            x: 69.5, z: 28, w: 4.55, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'right'
        };
        const room6417 = {
            id: '6417', name: 'Physics Lab-1 [6417LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 0, w: 12, d: 19,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6418 = {
            id: '6418', name: 'Physics Lab-2 [6418LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 21, w: 12, d: 19,
            isCorridor: false, isStair: false, isLift: false
        };
        // Corridor segments (5 pieces)
        const corridorSegments = [
            { id: `COR4_A`, name: 'Corridor A', type: ROOM_TYPES.CORRIDOR, x: 8,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR4_B`, name: 'Corridor B', type: ROOM_TYPES.CORRIDOR, x: 21,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR4_C`, name: 'Corridor C', type: ROOM_TYPES.CORRIDOR, x: 34,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR4_D`, name: 'Corridor D', type: ROOM_TYPES.CORRIDOR, x: 47,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR4_E`, name: 'Corridor E', type: ROOM_TYPES.CORRIDOR, x: 60,  z: 12, w: 13, d: 16, isCorridor: true }
        ];

        // Combine all rooms
        const allRooms = [
            room6408, room6407, room6406,
            leftLift, leftStair,
            room6405, room6409, room6410, room6411, boysToilet, girlsToilet,
            room6414, room6415, room6416, rightLift, room6417, room6418,
            room6404, room6403, room6402, room6401, rightStair,
            ...corridorSegments
        ];

        return allRooms.map(r => ({
            id: r.id, name: r.name, floor: floorIdx, type: r.type,
            x: r.x, z: r.z, w: r.w, d: r.d,
            center_x: r.x + r.w/2, center_z: r.z + r.d/2, center_y: FLOOR_Y[floorIdx],
            is_corridor: r.isCorridor ? 1 : 0,
            is_stair: r.isStair ? 1 : 0,
            is_lift: r.isLift ? 1 : 0,
            side: r.side || null
        }));
    } // working from here-
    if (floorIdx === 5) {
        // --- Left side: vertical stack of four rooms ---
        const room6508 = {
            id: '6508', name: 'Basic Electronic Lab [6508LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 0, w: 12, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6507 = {
            id: '6507', name: 'Electonic & Machine Lab[6507LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 14, w: 12, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6506 = {
            id: '6506', name: 'Basic Electronic Engineering Lab [6506LA]', type: ROOM_TYPES.LAB,
            x: -5, z: 28, w: 12, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        // --- Left lift and left staircase (same positions as ground floor) ---
        const leftLift = {
            id: `LL5`, name: 'Left Lift', type: ROOM_TYPES.LIFT_LEFT,
            x: 7.5, z: 0, w: 4.5, d: 12,
            isCorridor: false, isStair: false, isLift: true, side: 'left'
        };
        const leftStair = {
            id: `SL5`, name: 'Left Staircase', type: ROOM_TYPES.STAIR_LEFT,
            x: 7.5, z: 28, w: 4.5, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'left'
        };
        const room6505 = {
            id: '6505', name: 'Language Lab-1 [6505LA]', type: ROOM_TYPES.LAB,
            x: 12.5, z: 28, w: 7.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6504 = {
            id: '6504', name: 'Language Lab-2 [6504LA]', type: ROOM_TYPES.LAB,
            x: 20, z: 28, w: 7.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6503 = {
            id: '6503', name: 'Math Lab [6503LA]', type: ROOM_TYPES.LAB,
            x: 27.5, z: 28, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        }
        // --- Rest of the top row (right of the lift) ---
        const room6509 = {
            id: '6509', name: 'Class Room [6509CR]', type: ROOM_TYPES.CLASSROOM,
            x: 12.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6510 = {
            id: '6510', name: 'Faculty Cabin [6510FC]', type: ROOM_TYPES.OFFICE,
            x: 20.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6511 = {
            id: '6511', name: 'Faculty Cabin [6511FC]', type: ROOM_TYPES.OFFICE,
            x: 28.5, z: 0, w: 7, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const boysToilet = {
            id: '6512', name: 'Boys Toilet [6512TB]', type: ROOM_TYPES.TOILET,
            x: 35.5, z: 0, w: 5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const girlsToilet = {
            id: '6513', name: 'Girls Toilet [6513TG]', type: ROOM_TYPES.TOILET,
            x: 40.5, z: 0, w: 5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6514 = {
            id: '6514', name: 'Faculty Cabin [6514FC]', type: ROOM_TYPES.OFFICE,
            x: 45.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6515 = {
            id: '6515', name: 'Class Room [6515CR]', type: ROOM_TYPES.CLASSROOM,
            x: 53.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6516 = {
            id: '6516', name: 'HOD of Applied Science & Humanities [6516FC]', type: ROOM_TYPES.OFFICE,
            x: 61.5, z: 0, w: 8, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const rightLift = {
            id: `LR5`, name: 'Right Lift', type: ROOM_TYPES.LIFT_RIGHT,
            x: 69.5, z: 0, w: 4.55, d: 12,
            isCorridor: false, isStair: false, isLift: true, side: 'right'
        };
        
        // --- Bottom row (right of the left staircase, then middle stair, then right side) ---
        const room6502 = {
            id: '6502', name: 'Class Room [6502CR]', type: ROOM_TYPES.CLASSROOM,
            x: 45.5, z: 28, w: 11.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6501 = {
            id: '6501', name: 'Class Room [6501CR]', type: ROOM_TYPES.CLASSROOM,
            x: 57, z: 28, w: 11.5, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const rightStair = {
            id: `SR5`, name: 'Right Staircase', type: ROOM_TYPES.STAIR_RIGHT,
            x: 69.5, z: 28, w: 4.55, d: 12,
            isCorridor: false, isStair: true, isLift: false, side: 'right'
        };
        const room6517 = {
            id: '6517', name: 'Artifical Inteligence Lab [6517LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 0, w: 12, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6518 = {
            id: '6518', name: 'Algorithmic Lab [6518LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 14, w: 12, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
        const room6519 = {
            id: '6519', name: 'Programming Lab [6519LA]', type: ROOM_TYPES.LAB,
            x: 74.5, z: 28, w: 12, d: 12,
            isCorridor: false, isStair: false, isLift: false
        };
    // Corridor segments (5 pieces)
        const corridorSegments = [
            { id: `COR5_A`, name: 'Corridor A', type: ROOM_TYPES.CORRIDOR, x: 8,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR5_B`, name: 'Corridor B', type: ROOM_TYPES.CORRIDOR, x: 21,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR5_C`, name: 'Corridor C', type: ROOM_TYPES.CORRIDOR, x: 34,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR5_D`, name: 'Corridor D', type: ROOM_TYPES.CORRIDOR, x: 47,  z: 12, w: 13, d: 16, isCorridor: true },
            { id: `COR5_E`, name: 'Corridor E', type: ROOM_TYPES.CORRIDOR, x: 60,  z: 12, w: 13, d: 16, isCorridor: true }
        ];

        // Combine all rooms
        const allRooms = [
            room6508, room6507, room6506,
            leftLift, leftStair,
            room6505, room6509, room6510, room6511, boysToilet, girlsToilet,
            room6514, room6515, room6516, rightLift, room6517, room6518, room6519,
            room6504, room6503, room6502, room6501, rightStair,
            ...corridorSegments
        ];

        return allRooms.map(r => ({
            id: r.id, name: r.name, floor: floorIdx, type: r.type,
            x: r.x, z: r.z, w: r.w, d: r.d,
            center_x: r.x + r.w/2, center_z: r.z + r.d/2, center_y: FLOOR_Y[floorIdx],
            is_corridor: r.isCorridor ? 1 : 0,
            is_stair: r.isStair ? 1 : 0,
            is_lift: r.isLift ? 1 : 0,
            side: r.side || null
        }));
    }

    // ---- Upper floors (1..5) standard layout ----
    // Top row rooms (01..06)
    const topRooms = [];
    for (let i = 1; i <= 6; i++) {
        const id = `${building}${floorDigit}${i.toString().padStart(2,'0')}`;
        const name = `Room ${id}`;
        const type = (i === 3 || i === 6) ? ROOM_TYPES.LAB : ROOM_TYPES.CLASSROOM;
        const x = [2, 14, 26, 42, 54, 66][i-1];
        topRooms.push({
            id, name, type, x, z: 0, w: 10, d: 12,
            isCorridor: false, isStair: false, isLift: false
        });
    }
    // Bottom row rooms (07..12)
    const botRooms = [];
    for (let i = 7; i <= 12; i++) {
        const id = `${building}${floorDigit}${i.toString().padStart(2,'0')}`;
        const name = `Room ${id}`;
        const type = (i === 9 || i === 12) ? ROOM_TYPES.LAB : ROOM_TYPES.CLASSROOM;
        const x = [2, 14, 26, 42, 54, 66][i-7];
        botRooms.push({
            id, name, type, x, z: 28, w: 10, d: 12,
            isCorridor: false, isStair: false, isLift: false
        });
    }

    // Structural elements (same positions for all floors)
    const structural = [
        { id: `SL${floorIdx}`, name: 'Left Staircase', type: ROOM_TYPES.STAIR_LEFT, x: -8, z: 13, w: 7, d: 14, isCorridor: false, isStair: true, isLift: false, side: 'left' },
        { id: `SR${floorIdx}`, name: 'Right Staircase', type: ROOM_TYPES.STAIR_RIGHT, x: 81, z: 13, w: 7, d: 14, isCorridor: false, isStair: true, isLift: false, side: 'right' },
        { id: `LL${floorIdx}`, name: 'Left Lift', type: ROOM_TYPES.LIFT_LEFT, x: -8, z: 0, w: 7, d: 12, isCorridor: false, isStair: false, isLift: true, side: 'left' },
        { id: `LR${floorIdx}`, name: 'Right Lift', type: ROOM_TYPES.LIFT_RIGHT, x: 81, z: 28, w: 7, d: 12, isCorridor: false, isStair: false, isLift: true, side: 'right' },
        { id: `COR${floorIdx}`, name: 'Main Corridor', type: ROOM_TYPES.CORRIDOR, x: 0, z: 12, w: 80, d: 16, isCorridor: true, isStair: false, isLift: false }
    ];

    if (floorIdx === 0 || floorIdx === 1) {
        structural.push({
            id: `SM${floorIdx}`, name: 'Middle Staircase', type: ROOM_TYPES.STAIR_MID,
            x: 37, z: 13, w: 6, d: 14, isCorridor: false, isStair: true, isLift: false, side: 'mid'
        });
    }

    const allRooms = [...topRooms, ...botRooms, ...structural];
    return allRooms.map(r => ({
        id: r.id,
        name: r.name,
        floor: floorIdx,
        type: r.type,
        x: r.x,
        z: r.z,
        w: r.w,
        d: r.d,
        center_x: r.x + r.w/2,
        center_z: r.z + r.d/2,
        center_y: FLOOR_Y[floorIdx],
        is_corridor: r.isCorridor ? 1 : 0,
        is_stair: r.isStair ? 1 : 0,
        is_lift: r.isLift ? 1 : 0,
        side: r.side || null
    }));
}

// function generateEdges(rooms) {
//     const edges = [];
//     const roomMap = {};
//     rooms.forEach(r => roomMap[r.id] = r);

//     function addEdge(fromId, toId, weight) {
//         if (!roomMap[fromId] || !roomMap[toId]) return;
//         edges.push({ from: fromId, to: toId, weight });
//         edges.push({ from: toId, to: fromId, weight });
//     }

//     // Connect each room to its floor's corridor
//     for (let f = 0; f < 6; f++) {
//         const cor = `COR${f}`;
        
//         if (f === 0) {
//             // Ground floor: IDs 6001..6014
//             for (let i = 1; i <= 14; i++) {
//                 const id = `60${i.toString().padStart(2,'0')}`;
//                 if (roomMap[id]) addEdge(id, cor, 8);
//             }
//         } 
//         else if (f === 1) {
//             // First floor: all custom rooms (non‑structural)
//             const firstFloorIds = [
//                 // Top row (z=0)
//                 '6108', '6109', '6110', '6111', '6112', '6113', '6114', '6115', '6117', '6118', '6119',
//                 // Bottom row (z=28)
//                 '6101', '6102', '6103', '6104', '6105', '6106', '6107', '6120'
//             ];
//             for (const id of firstFloorIds) {
//                 if (roomMap[id]) addEdge(id, cor, 8);
//             }
//         }
//         else if (f === 2) {
//             // Second floor: only custom room IDs (NO structural IDs!)
//             const secondFloorIds = [
//                 '6201', '6202', '6203', '6204', '6205', '6206', '6207', '6208', '6209',
//                 '6210', '6211', '6212', '6213', '6214', '6215', '6216', '6217', '6218',
//                 '6219', '6220', '6221', '6222'
//             ];
//             for (const id of secondFloorIds) {
//                 if (roomMap[id]) addEdge(id, cor, 8);
//             }
//         }
//         else if (f === 3) {
//             // Third floor: all custom room IDs (6301..6319)
//             const thirdFloorIds = [
//                 '6301', '6302', '6303', '6304', '6305', '6306', '6307', '6308', '6309',
//                 '6310', '6311', '6312', '6313', '6314', '6315', '6316', '6317', '6318', '6319'
//             ];
//             for (const id of thirdFloorIds) {
//                 if (roomMap[id]) addEdge(id, cor, 8);
//             }
//         }
//         else if (f === 4) {
//             // Fourth floor: all custom room IDs (6401..6419)
//             const fourthFloorIds = [
//                 '6401', '6402', '6403', '6404', '6405', '6406', '6407', '6408', '6409',
//                 '6410', '6411', '6412', '6413', '6414', '6415', '6416', '6417', '6418', '6419'
//             ];
//             for (const id of fourthFloorIds) {
//                 if (roomMap[id]) addEdge(id, cor, 8);
//             }
//         }
//         else if (f === 5) {
//             // Fifth floor: all custom room IDs (6501..6519)
//             const fifthFloorIds = [
//                 '6501', '6502', '6503', '6504', '6505', '6506', '6507', '6508', '6509',
//                 '6510', '6511', '6512', '6513', '6514', '6515', '6516', '6517', '6518', '6519'
//             ];
//             for (const id of fifthFloorIds) {
//                 if (roomMap[id]) addEdge(id, cor, 8);
//             }
//         }
//         else {
//             // Floors 2..5: standard pattern (01..12)
//             for (let i = 1; i <= 12; i++) {
//                 const id = `6${f}${i.toString().padStart(2,'0')}`;
//                 if (roomMap[id]) addEdge(id, cor, 8);
//             }
//         }

//         // Structural connections (stairs, lifts, middle stairs)
//         addEdge(`SL${f}`, cor, 6);
//         addEdge(`SR${f}`, cor, 6);
//         addEdge(`LL${f}`, cor, 8);
//         addEdge(`LR${f}`, cor, 8);
//         if (f <= 1) addEdge(`SM${f}`, cor, 4);
//     }

//     // Inter-floor stairs (same cost as lifts now)
//     for (let f = 0; f < 5; f++) {
//         addEdge(`SL${f}`, `SL${f+1}`, 8);
//         addEdge(`SR${f}`, `SR${f+1}`, 8);
//     }
//     // Middle staircase (only ground‑first)
//     addEdge('SM0', 'SM1', 8);

//     // Lifts (adjacent floors)
//     for (let f = 0; f < 5; f++) {
//         addEdge(`LL${f}`, `LL${f+1}`, 8);
//         addEdge(`LR${f}`, `LR${f+1}`, 8);
//     }
//     // Direct lift connections across floors
//     for (let f = 0; f < 6; f++) {
//         for (let g = f+2; g < 6; g++) {
//             addEdge(`LL${f}`, `LL${g}`, Math.abs(f-g) * 8);
//             addEdge(`LR${f}`, `LR${g}`, Math.abs(f-g) * 8);
//         }
//     }

//     return edges;
// }

// function generateEdges(rooms) {
//     const edges = [];
//     const roomMap = {};
//     rooms.forEach(r => roomMap[r.id] = r);

//     function addEdge(fromId, toId, weight) {
//         if (!roomMap[fromId] || !roomMap[toId]) return;
//         edges.push({ from: fromId, to: toId, weight });
//         edges.push({ from: toId, to: fromId, weight });
//     }

//     // 1. Room-to-corridor connections (keep as before)
//     // for (let f = 0; f < 6; f++) {
//     //     const cor = `COR${f}`;
//     //     const roomsOnFloor = rooms.filter(r => r.floor === f && !r.is_corridor && !r.is_stair && !r.is_lift);
//     //     for (let room of roomsOnFloor) {
//     //         addEdge(room.id, cor, 8);   // keep existing corridor connection
//     //     }

//     //     // 2. Direct room-to-stairs (and room-to-lifts) based on Euclidean distance
//     //     const stairs = rooms.filter(r => r.floor === f && r.is_stair);
//     //     const lifts = rooms.filter(r => r.floor === f && r.is_lift);
        
//     //     for (let room of roomsOnFloor) {
//     //         // to each stair on same floor
//     //         for (let stair of stairs) {
//     //             // entrance point: center of the stair room
//     //             const dx = room.center_x - stair.center_x;
//     //             const dz = room.center_z - stair.center_z;
//     //             const dist = Math.hypot(dx, dz);   // Euclidean distance
//     //             addEdge(room.id, stair.id, dist);
//     //         }
//     //         // to each lift on same floor
//     //         for (let lift of lifts) {
//     //             const dx = room.center_x - lift.center_x;
//     //             const dz = room.center_z - lift.center_z;
//     //             const dist = Math.hypot(dx, dz);
//     //             addEdge(room.id, lift.id, dist);
//     //         }
//     //     }
//     // }

//     // Inside generateEdges, after connecting rooms to corridor:
//     for (let f = 0; f < 6; f++) {
//         const cor = `COR${f}`;
//         const stairs = rooms.filter(r => r.floor === f && r.is_stair);
//         const lifts = rooms.filter(r => r.floor === f && r.is_lift);
//         const roomsOnFloor = rooms.filter(r => r.floor === f && !r.is_corridor && !r.is_stair && !r.is_lift);

//         for (let room of roomsOnFloor) {
//             addEdge(room.id,cor,5);
//             for (let stair of stairs) {
//             const dx = room.center_x - stair.center_x;
//             const dz = room.center_z - stair.center_z;
//             const dist = Math.hypot(dx, dz);
//             addEdge(room.id, stair.id, dist);
//             }
//             for (let lift of lifts) {
//             const dx = room.center_x - lift.center_x;
//             const dz = room.center_z - lift.center_z;
//             const dist = Math.hypot(dx, dz);
//             addEdge(room.id, lift.id, dist);
//             }
//         }
//     }

//     // 3. Inter-floor stair/lift connections (keep existing)
//     for (let f = 0; f < 5; f++) {
//         addEdge(`SL${f}`, `SL${f+1}`, 8);
//         addEdge(`SR${f}`, `SR${f+1}`, 8);
//         addEdge(`LL${f}`, `LL${f+1}`, 8);
//         addEdge(`LR${f}`, `LR${f+1}`, 8);
//     }
//     addEdge('SM0', 'SM1', 8);

//     // 4. Direct lift multi-floor (optional, keep as before)
//     for (let f = 0; f < 6; f++) {
//         for (let g = f+2; g < 6; g++) {
//             addEdge(`LL${f}`, `LL${g}`, Math.abs(f-g) * 8);
//             addEdge(`LR${f}`, `LR${g}`, Math.abs(f-g) * 8);
//         }
//     }
//     // stairs.forEach(s => addEdge(cor, s.id, 4));
//     // lifts.forEach(l => addEdge(cor, l.id, 6));

//     return edges;
// }

function generateEdges(rooms) {
    const edges = [];
    const roomMap = {};
    rooms.forEach(r => roomMap[r.id] = r);

    function addEdge(fromId, toId, weight) {
        if (!roomMap[fromId] || !roomMap[toId]) return;
        edges.push({ from: fromId, to: toId, weight });
        edges.push({ from: toId, to: fromId, weight });
    }

    // For each floor
    for (let f = 0; f < 6; f++) {
        const segments = ['A','B','C','D','E'].map(letter => ({
            id: `COR${f}_${letter}`,
            xMin: [-5, 13, 31, 49, 67][letter.charCodeAt(0)-65],
            xMax: [-5+18, 13+18, 31+18, 49+18, 67+18][letter.charCodeAt(0)-65]
        }));

        // Connect corridor segments sequentially (A-B, B-C, C-D, D-E)
        for (let i = 0; i < segments.length - 1; i++) {
            const segA = segments[i].id;
            const segB = segments[i+1].id;
            // Distance between centers: (xMax - xMin)/2 difference
            const centerA = (segments[i].xMin + segments[i].xMax) / 2;
            const centerB = (segments[i+1].xMin + segments[i+1].xMax) / 2;
            const dist = Math.abs(centerB - centerA);
            addEdge(segA, segB, dist);
        }

        const stairs = rooms.filter(r => r.floor === f && r.is_stair);
        const lifts = rooms.filter(r => r.floor === f && r.is_lift);
        const roomsOnFloor = rooms.filter(r => r.floor === f && !r.is_corridor && !r.is_stair && !r.is_lift);

        // Connect each room to the nearest corridor segment
        for (let room of roomsOnFloor) {
            const seg = segments.find(s => room.center_x >= s.xMin && room.center_x <= s.xMax);
            if (seg) {
                const dx = room.center_x - (seg.xMin + seg.xMax)/2;
                const dist = Math.hypot(dx, 0); // same z, only x distance
                addEdge(room.id, seg.id, dist);
            }
        }

        // Connect stairs and lifts to the nearest corridor segment as well
        for (let stair of stairs) {
            const seg = segments.find(s => stair.center_x >= s.xMin && stair.center_x <= s.xMax);
            if (seg) {
                const dx = stair.center_x - (seg.xMin + seg.xMax)/2;
                const dist = Math.hypot(dx, 0);
                addEdge(stair.id, seg.id, dist);
            }
        }
        for (let lift of lifts) {
            const seg = segments.find(s => lift.center_x >= s.xMin && lift.center_x <= s.xMax);
            if (seg) {
                const dx = lift.center_x - (seg.xMin + seg.xMax)/2;
                const dist = Math.hypot(dx, 0);
                addEdge(lift.id, seg.id, dist);
            }
        }
    }

    // Inter-floor stairs/lifts (unchanged)
    for (let f = 0; f < 5; f++) {
        addEdge(`SL${f}`, `SL${f+1}`, 8);
        addEdge(`SR${f}`, `SR${f+1}`, 8);
        addEdge(`LL${f}`, `LL${f+1}`, 8);
        addEdge(`LR${f}`, `LR${f+1}`, 8);
    }
    addEdge('SM0', 'SM1', 8);

    for (let f = 0; f < 6; f++) {
        for (let g = f+2; g < 6; g++) {
            addEdge(`LL${f}`, `LL${g}`, Math.abs(f-g) * 8);
            addEdge(`LR${f}`, `LR${g}`, Math.abs(f-g) * 8);
        }
    }

    return edges;
}


// ----------------------------------------------------------------------
//  Database initialization
// ----------------------------------------------------------------------
function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS rooms (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            floor INTEGER NOT NULL,
            type TEXT NOT NULL,
            x REAL NOT NULL,
            z REAL NOT NULL,
            w REAL NOT NULL,
            d REAL NOT NULL,
            center_x REAL NOT NULL,
            center_z REAL NOT NULL,
            center_y REAL NOT NULL,
            is_corridor INTEGER DEFAULT 0,
            is_stair INTEGER DEFAULT 0,
            is_lift INTEGER DEFAULT 0,
            side TEXT
        )`, err => { if (err) console.error('rooms table error:', err); else console.log('Rooms table ready'); });

        db.run(`CREATE TABLE IF NOT EXISTS edges (
            from_room TEXT NOT NULL,
            to_room TEXT NOT NULL,
            weight REAL NOT NULL,
            PRIMARY KEY (from_room, to_room),
            FOREIGN KEY (from_room) REFERENCES rooms(id),
            FOREIGN KEY (to_room) REFERENCES rooms(id)
        )`, err => { if (err) console.error('edges table error:', err); else console.log('Edges table ready'); });

        db.get("SELECT COUNT(*) as count FROM rooms", (err, row) => {
            if (err) { console.error('Error checking rooms:', err); return; }
            if (row.count === 0) {
                console.log('Populating database...');
                const rooms = [];
                for (let f = 0; f < 6; f++) rooms.push(...generateFloorRooms(f));

                const stmt = db.prepare(`INSERT INTO rooms 
                    (id, name, floor, type, x, z, w, d, center_x, center_z, center_y, is_corridor, is_stair, is_lift, side) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
                rooms.forEach(room => stmt.run(
                    room.id, room.name, room.floor, room.type,
                    room.x, room.z, room.w, room.d,
                    room.center_x, room.center_z, room.center_y,
                    room.is_corridor, room.is_stair, room.is_lift, room.side
                ));
                stmt.finalize();

                const edges = generateEdges(rooms);
                const edgeStmt = db.prepare("INSERT INTO edges (from_room, to_room, weight) VALUES (?, ?, ?)");
                edges.forEach(edge => edgeStmt.run(edge.from, edge.to, edge.weight));
                edgeStmt.finalize();

                console.log(`Database populated with ${rooms.length} rooms and ${edges.length} edges`);
            } else {
                console.log(`Database already contains ${row.count} rooms`);
            }
        });
    });
}

// ----------------------------------------------------------------------
//  Dijkstra implementation (unchanged)
// ----------------------------------------------------------------------
function dijkstra(rooms, edges, srcId, dstId) {
    const roomMap = {};
    rooms.forEach(r => roomMap[r.id] = r);
    const adj = {};
    rooms.forEach(r => adj[r.id] = []);
    edges.forEach(e => {
        adj[e.from_room].push({ id: e.to_room, weight: e.weight });
        adj[e.to_room].push({ id: e.from_room, weight: e.weight });
    });
    const dist = {}, prev = {}, visited = new Set();
    rooms.forEach(r => { dist[r.id] = Infinity; prev[r.id] = null; });
    dist[srcId] = 0;
    const pq = [{ id: srcId, d: 0 }];
    while (pq.length) {
        pq.sort((a,b) => a.d - b.d);
        const { id: u } = pq.shift();
        if (visited.has(u)) continue;
        visited.add(u);
        if (u === dstId) break;
        (adj[u] || []).forEach(({ id: v, weight }) => {
            const alt = dist[u] + weight;
            if (alt < dist[v]) { dist[v] = alt; prev[v] = u; pq.push({ id: v, d: alt }); }
        });
    }
    const path = [];
    let cur = dstId;
    while (cur) { path.unshift(cur); cur = prev[cur]; }
    if (path[0] !== srcId) return null;
    return { path, cost: dist[dstId] };
}

// ----------------------------------------------------------------------
//  API routes
// ----------------------------------------------------------------------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'main.html')));

app.get('/api/rooms', (req, res) => {
    db.all("SELECT * FROM rooms ORDER BY floor, id", (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.get('/api/edges', (req, res) => {
    db.all("SELECT * FROM edges", (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.get('/api/shortest-path', (req, res) => {
    const { src, dst } = req.query;
    if (!src || !dst) return res.status(400).json({ error: 'Source and destination are required' });
    db.all("SELECT * FROM rooms", (err, rooms) => {
        if (err) return res.status(500).json({ error: err.message });
        db.all("SELECT * FROM edges", (err, edges) => {
            if (err) return res.status(500).json({ error: err.message });
            const result = dijkstra(rooms, edges, src, dst);
            if (!result) return res.status(404).json({ error: 'No path found' });
            res.json(result);
        });
    });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));