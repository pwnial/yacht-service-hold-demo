/* Yacht Service Ltd — Fall 2026.
   Mock yard data. No money moves here, no messages go out. */

const YARD = {
  name: 'Yacht Service Ltd',
  street: '144 Ocean Ave',
  town: 'Amityville, NY',
  phone: '(631) 555-0100',
  season: 'Fall 2026',
  owner: 'Todd',
  tonight: 'Thu Oct 1',
  clock: '8:04'
};

/* Haul weeks. booked/cap covers the whole yard, not just the ten boats
   Todd is chasing tonight. */
const WEEKS = [
  { id:'oct6',  label:'Oct 6',  full:'Week of Oct 6',  days:'Tue Oct 6 – Fri Oct 9',   cap:12, booked:11, sailOnly:false },
  { id:'oct13', label:'Oct 13', full:'Week of Oct 13', days:'Tue Oct 13 – Fri Oct 16', cap:12, booked:10, sailOnly:false, toddsPick:true },
  { id:'oct20', label:'Oct 20', full:'Week of Oct 20', days:'Tue Oct 20 – Fri Oct 23', cap:12, booked:5,  sailOnly:false },
  { id:'oct27', label:'Oct 27', full:'Week of Oct 27', days:'Tue Oct 27 – Fri Oct 30', cap:12, booked:9,  sailOnly:false },
  { id:'nov3',  label:'Nov 3',  full:'Week of Nov 3',  days:'Tue Nov 3 – Fri Nov 6',   cap:6,  booked:3,  sailOnly:true }
];

/* Statuses: sent | chase | callme | held | hauled | stored */
const BOATS = [
  {
    slug:'reel-therapy', name:'Reel Therapy',
    make:"28' Grady-White Sailfish 282", len:28, hull:'walkaround', rig:'power',
    tint:'#E6DDCC', stripe:'#C4A46A',
    owner:'Sal DeLuca', first:'Sal', phone:'(631) 555-0142',
    berth:'Slip B-14', berthShort:'B-14', since:2019,
    week:'oct13', price:1850, status:'sent', linksSent:1,
    lot:'Row C, north lot',
    engines:'twin Yamaha F200s',
    plan:'Haul her the week of Oct 13. Winterize both engines, shrink wrap her, and block her on the north lot for the winter.',
    line:['Haul out and pressure wash','Winterize twin Yamaha F200s','Shrink wrap — vented, zipper door','Land storage — Row C, north lot'],
    note:'Port engine hard start — check impellers at winterize.',
    steps:[
      {label:'Hauled',            detail:'Travel lift, Tuesday morning'},
      {label:'Engines winterized',detail:'Both F200s, fresh gear oil'},
      {label:'Wrapped',           detail:'Vented, with a zipper door'},
      {label:'Blocked on land',   detail:'Row C, north lot'}
    ],
    done:0
  },
  {
    slug:'miss-peggy', name:'Miss Peggy',
    make:"31' Bertram flybridge (1978, restored)", len:31, hull:'flybridge', rig:'power', bulk:'low',
    tint:'#D6CDB8', stripe:'#8A8476',
    owner:'Frank Caruso', first:'Frank', phone:'(631) 555-0119',
    berth:'Slip A-2', berthShort:'A-2', since:2011,
    week:'oct6', price:2150, status:'hauled', linksSent:1, deposit:200,
    lot:'Row A, north lot',
    engines:'twin 350 gas inboards',
    plan:'Haul her the week of Oct 6. Winterize both 350s, wrap her vented like always, and block her up front on Row A.',
    line:['Haul out and pressure wash','Winterize twin 350 inboards','Shrink wrap — vented','Land storage — Row A, north lot'],
    note:'Frank wants the wrap vented like last year.',
    early:'Frank had us pull her Tuesday — he was done for the season.',
    steps:[
      {label:'Hauled',            detail:'Tue Sep 29'},
      {label:'Engines winterized',detail:'Wed Sep 30 — both 350s'},
      {label:'Wrapped',           detail:'Friday, vented like last year'},
      {label:'Blocked on land',   detail:'Row A, north lot'}
    ],
    done:2
  },
  {
    slug:'knot-home', name:'Knot Home',
    make:"25' Steiger Craft 255 DV", len:25, hull:'pilothouse', rig:'power',
    tint:'#7E938C', stripe:'#E6DDCC',
    owner:'Mike Brennan', first:'Mike', phone:'(631) 555-0163',
    berth:'Slip C-7', berthShort:'C-7', since:2016,
    week:'oct20', price:1650, status:'held', linksSent:1, deposit:200,
    lot:'Row B, north lot',
    engines:'single Yamaha F300',
    plan:'Haul her the week of Oct 20. Winterize the F300, wrap her, and block her on Row B.',
    line:['Haul out and pressure wash','Winterize the Yamaha F300','Shrink wrap — vented','Land storage — Row B, north lot'],
    note:'Leave the pilothouse door cracked — she sweats.',
    steps:[
      {label:'Hauled',            detail:'Tue Oct 20'},
      {label:'Engine winterized', detail:'F300, fresh gear oil'},
      {label:'Wrapped',           detail:'Vented, door cracked'},
      {label:'Blocked on land',   detail:'Row B, north lot'}
    ],
    done:0
  },
  {
    slug:'salt-shaker', name:'Salt Shaker',
    make:"23' Regulator 23", len:23, hull:'centerconsole', rig:'power',
    tint:'#9DA9A2', stripe:'#E6DDCC',
    owner:'Danny Pagano', first:'Danny', phone:'(631) 555-0118',
    berth:'Slip B-3', berthShort:'B-3', since:2021,
    week:'oct13', price:1500, status:'callme', linksSent:1,
    lot:'Row C, north lot',
    engines:'single Yamaha F250',
    plan:'Haul her the week of Oct 13. Winterize the F250, wrap her, block her on Row C.',
    line:['Haul out and pressure wash','Winterize the Yamaha F250','Shrink wrap — vented','Land storage — Row C, north lot'],
    note:'Danny texted "call me" — wants to talk about a bottom job before she goes away.',
    steps:[
      {label:'Hauled',            detail:'Tue Oct 13'},
      {label:'Engine winterized', detail:'F250, fresh gear oil'},
      {label:'Wrapped',           detail:'Vented, zipper door'},
      {label:'Blocked on land',   detail:'Row C, north lot'}
    ],
    done:0
  },
  {
    slug:'second-wind', name:'Second Wind',
    make:"30' Pearson 303 sloop", len:30, hull:'sloop', rig:'sail',
    tint:'#DDD3BC', stripe:'#8A8476',
    owner:'Ruth & Howie Lindqvist', first:'Ruth', phone:'(631) 555-0177',
    berth:'Mooring 6', berthShort:'Mooring 6', since:2008,
    week:'nov3', price:2400, status:'held', linksSent:1, deposit:200,
    lot:'Row A, north lot',
    engines:'Universal 18 diesel',
    plan:'Pull her off the mooring the week of Nov 3. Unstep the mast, spars on rack 2, winterize the diesel, wrap her, block her on Row A.',
    line:['Haul out and pressure wash','Unstep the mast — spars on rack 2','Winterize the Universal 18','Shrink wrap — vented','Land storage — Row A, north lot'],
    note:'Unstep mast, spars on rack 2.',
    steps:[
      {label:'Hauled',           detail:'Tue Nov 3, off the mooring'},
      {label:'Mast unstepped',   detail:'Spars on rack 2'},
      {label:'Engine winterized',detail:'Universal 18 diesel'},
      {label:'Wrapped',          detail:'Vented, over the cabin'},
      {label:'Blocked on land',  detail:'Row A, north lot'}
    ],
    done:0
  },
  {
    slug:'osprey', name:'Osprey',
    make:"17' Boston Whaler Montauk", len:17, hull:'whaler', rig:'power',
    tint:'#C9B48A', stripe:'#0F1714',
    owner:'Katie Muller', first:'Katie', phone:'(631) 555-0134',
    berth:'Rack 14', berthShort:'Rack 14', since:2022,
    week:'oct27', price:980, status:'sent', linksSent:1,
    lot:'Rack 14, inside',
    engines:'Mercury 60',
    plan:'Haul her the week of Oct 27. Winterize the 60, cover her, and slide her back on rack 14 for the winter.',
    line:['Haul out and rinse','Winterize the Mercury 60','Canvas cover — no wrap needed','Rack storage — rack 14, inside'],
    note:'Katie is at school till Thanksgiving — text, do not call.',
    steps:[
      {label:'Hauled',           detail:'Tue Oct 27'},
      {label:'Engine winterized',detail:'Mercury 60'},
      {label:'Covered',          detail:'Her own canvas, no wrap'},
      {label:'Back on the rack', detail:'Rack 14, inside'}
    ],
    done:0
  },
  {
    slug:'tin-knocker', name:'Tin Knocker',
    make:"26' Parker 2520", len:26, hull:'walkaround', rig:'power',
    tint:'#33443E', stripe:'#C4A46A',
    owner:'Vinny Esposito', first:'Vinny', phone:'(631) 555-0126',
    berth:'Slip A-9', berthShort:'A-9', since:2014,
    week:'oct6', price:1700, status:'stored', linksSent:1, deposit:200, depositMethod:'cash',
    lot:'Row C, north lot',
    engines:'single Yamaha F250',
    plan:'Haul her the week of Oct 6. Winterize the F250, wrap her, block her on Row C. Early splash in April.',
    line:['Haul out and pressure wash','Winterize the Yamaha F250','Shrink wrap — vented','Land storage — Row C, north lot'],
    note:'Paid cash. Wants early splash in April.',
    early:'Vinny was done fishing — we pulled her a week early.',
    steps:[
      {label:'Hauled',           detail:'Mon Sep 28'},
      {label:'Engine winterized',detail:'Tue Sep 29 — F250'},
      {label:'Wrapped',          detail:'Wed Sep 30 — vented'},
      {label:'Blocked on land',  detail:'Row C, north lot'}
    ],
    done:4
  },
  {
    slug:'sofia-rose', name:'Sofia Rose',
    make:"35' Silverton 34 Convertible", len:35, hull:'flybridge', rig:'power', bulk:'tall',
    tint:'#EDE4D2', stripe:'#8A8476',
    owner:'the Marchetti family', first:'Nick', phone:'(631) 555-0151',
    berth:'Slip A-1', berthShort:'A-1', since:2013,
    week:'oct20', price:2900, status:'chase', linksSent:2,
    lot:'Row A, north lot',
    engines:'twin Crusader 350s',
    plan:'Haul her the week of Oct 20. Winterize both Crusaders, wrap her over the bridge, block her on Row A.',
    line:['Haul out and pressure wash','Winterize twin Crusader 350s','Shrink wrap — over the bridge, vented','Land storage — Row A, north lot'],
    note:'Two links out, nothing back. Nick works nights — try after 9.',
    steps:[
      {label:'Hauled',            detail:'Tue Oct 20'},
      {label:'Engines winterized',detail:'Both Crusaders'},
      {label:'Wrapped',           detail:'Over the bridge, vented'},
      {label:'Blocked on land',   detail:'Row A, north lot'}
    ],
    done:0
  },
  {
    slug:'last-call', name:'Last Call',
    make:"29' Sea Ray Amberjack", len:29, hull:'express', rig:'power',
    tint:'#D9D0BB', stripe:'#C4A46A',
    owner:'Tommy Byrne', first:'Tommy', phone:'(631) 555-0108',
    berth:'Slip B-8', berthShort:'B-8', since:2018,
    week:'oct27', price:1900, status:'held', linksSent:1, deposit:200,
    lot:'Row B, north lot',
    engines:'twin 350 MAG inboards',
    plan:'Haul her the week of Oct 27. Winterize both 350s, wrap her, block her on Row B.',
    line:['Haul out and pressure wash','Winterize twin 350 MAG inboards','Shrink wrap — vented','Land storage — Row B, north lot'],
    note:'Bilge pump float switch is sticky. Look at it before she goes on the hard.',
    steps:[
      {label:'Hauled',            detail:'Tue Oct 27'},
      {label:'Engines winterized',detail:'Both 350 MAGs'},
      {label:'Wrapped',           detail:'Vented, zipper door'},
      {label:'Blocked on land',   detail:'Row B, north lot'}
    ],
    done:0
  },
  {
    slug:'irish-wake', name:'Irish Wake',
    make:"27' Blackfin Combi", len:27, hull:'express', rig:'power', riggers:true,
    tint:'#4E6158', stripe:'#E6DDCC',
    owner:'Pat Dolan', first:'Pat', phone:'(631) 555-0195',
    berth:'Slip C-2', berthShort:'C-2', since:2015,
    week:'oct13', price:1750, status:'held', linksSent:1, deposit:200,
    lot:'Row B, north lot',
    engines:'twin Crusader 270s',
    plan:'Haul her the week of Oct 13. Winterize both Crusaders, pull the riggers, wrap her, block her on Row B.',
    line:['Haul out and pressure wash','Winterize twin Crusader 270s','Outriggers off and inside','Shrink wrap — vented','Land storage — Row B, north lot'],
    note:'Take the outriggers off before the wrap. Last year they poked through.',
    steps:[
      {label:'Hauled',            detail:'Tue Oct 13'},
      {label:'Engines winterized',detail:'Both Crusader 270s'},
      {label:'Wrapped',           detail:'Riggers off first'},
      {label:'Blocked on land',   detail:'Row B, north lot'}
    ],
    done:0
  }
];

const HOLD = 200;
const HELD_STATES = ['held','hauled','stored'];
const BOAT_BY_SLUG = {};
BOATS.forEach(b => { BOAT_BY_SLUG[b.slug] = b; });
const WEEK_BY_ID = {};
WEEKS.forEach(w => { WEEK_BY_ID[w.id] = w; });
