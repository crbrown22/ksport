/**
 * KROME Sports Performance - Speed, Agility & Conditioning E-Book Blueprint Data
 * Complete Athletic Speed Curriculum containing:
 *  1) Dynamic Mobility & Movement Prep
 *  2) Plyometrics & Kinetic Elasticity
 *  3) Linear Speed & Acceleration Mechanics
 *  4) Change of Direction (COD) & Agility Vectors
 *  5) Anaerobic Work Capacity & Lactic Conditioning
 */

const SPEED_MOBILITY_DRILLS = [
    {
        id: "mob_1",
        category: "Dynamic Mobility & Movement Prep",
        name: "World's Greatest Stretch with Thoracic Rotation",
        setsReps: "2 sets x 5 reps/side",
        rest: "30s rest",
        focus: "Hip Flexor Flexion, Thoracic Mobility & Hamstring Lengthening",
        notes: "Step deep into a lunge, drop inside elbow to ground, rotate lead arm vertically up to sky, return and straighten front leg to stretch hamstring.",
        videoPlaceholder: "fas fa-sync-alt"
    },
    {
        id: "mob_2",
        category: "Dynamic Mobility & Movement Prep",
        name: "Ankle Dorsiflexion Wall Drives",
        setsReps: "3 sets x 10 reps/side",
        rest: "30s rest",
        focus: "Ankle Range of Motion & Achilles Tendon Stiffness",
        notes: "Place foot 4 inches from wall. Drive knee forward past toes without raising the heel. Essential for aggressive first-step acceleration angle.",
        videoPlaceholder: "fas fa-shoe-prints"
    },
    {
        id: "mob_3",
        category: "Dynamic Mobility & Movement Prep",
        name: "Band-Resisted Hip Opener & Flexor Activation",
        setsReps: "2 sets x 12 reps/side",
        rest: "30s rest",
        focus: "Psoas & Gluteus Medius Activation",
        notes: "Loop light band around ankles. Drive knee upward dynamically to 90 degrees while maintaining vertical torso posture.",
        videoPlaceholder: "fas fa-compress-arrows-alt"
    },
    {
        id: "mob_4",
        category: "Dynamic Mobility & Movement Prep",
        name: "Sagittal & Lateral Dynamic Leg Swings",
        setsReps: "2 sets x 15 swings/direction",
        rest: "30s rest",
        focus: "Dynamic Hamstring & Adductor Lengthening",
        notes: "Hold fence or wall. Swing leg forward/backward with controlled momentum, then side-to-side across body. Keep core braced.",
        videoPlaceholder: "fas fa-running"
    },
    {
        id: "mob_5",
        category: "Dynamic Mobility & Movement Prep",
        name: "Active Hamstring Neural Flossing",
        setsReps: "2 sets x 10 reps/side",
        rest: "30s rest",
        focus: "Sciatic Nerve Glide & Hamstring Compliance",
        notes: "Lie on back, flex hip to 90 degrees, interlock hands behind thigh. Extend knee to ceiling while flexing and extending ankle.",
        videoPlaceholder: "fas fa-wave-square"
    }
];

const PLYOMETRIC_DRILLS = [
    {
        id: "plyo_1",
        category: "Plyometrics & Kinetic Power",
        name: "Low-Amortization Ankle Pogo Hops",
        setsReps: "4 sets x 15 reps",
        rest: "45s rest",
        focus: "Lower Extremity Elastic Tendon Stiffness (< 0.12s contact)",
        notes: "Bounce exclusively off ball of foot with stiff ankles and minimal knee bend. Pretend ground is hot glass.",
        videoPlaceholder: "fas fa-arrows-alt-v"
    },
    {
        id: "plyo_2",
        category: "Plyometrics & Kinetic Power",
        name: "Snap Downs to Explosive Vertical Jump",
        setsReps: "4 sets x 5 reps",
        rest: "60s rest",
        focus: "Stretch-Shortening Cycle & Force Acceptance",
        notes: "Start tall on tiptoes, violently drop into athletic landing, then immediately explode into maximal vertical jump.",
        videoPlaceholder: "fas fa-bolt"
    },
    {
        id: "plyo_3",
        category: "Plyometrics & Kinetic Power",
        name: "Lateral Hurdle Bounds to Stick Landing",
        setsReps: "3 sets x 5 bounds/side",
        rest: "60s rest",
        focus: "Frontal Plane Elastic Power & Single-Leg Stability",
        notes: "Jump sideways over 12-inch hurdle, absorb force on outside leg with knee tracking over toes, hold landing for 2 seconds.",
        videoPlaceholder: "fas fa-compress-alt"
    },
    {
        id: "plyo_4",
        category: "Plyometrics & Kinetic Power",
        name: "Split-Squat Scissor Jumps",
        setsReps: "3 sets x 6 jumps/side",
        rest: "60s rest",
        focus: "Bilateral-to-Unilateral Rate of Force Development",
        notes: "Begin in lunge position, drive vertically upward, switch legs in mid-air, and land smoothly in opposite lunge posture.",
        videoPlaceholder: "fas fa-exchange-alt"
    },
    {
        id: "plyo_5",
        category: "Plyometrics & Kinetic Power",
        name: "Depth Jump to Explosive Broad Jump",
        setsReps: "4 sets x 4 reps",
        rest: "90s rest",
        focus: "Reactive Eccentric Loading & Horizontal Displacement",
        notes: "Step off 18-inch box (do not hop), hit turf, bounce instantly into maximal forward broad jump.",
        videoPlaceholder: "fas fa-long-arrow-alt-right"
    },
    {
        id: "plyo_6",
        category: "Plyometrics & Kinetic Power",
        name: "Rotational Medicine Ball Deceleration Slams",
        setsReps: "3 sets x 8 reps/side",
        rest: "60s rest",
        focus: "Core Rotational Braking & Kinetic Chain Transfer",
        notes: "Using 10lb non-bounce med ball, reach high overhead, rotate hips dynamically, slam ball down hard into turf outside lead foot.",
        videoPlaceholder: "fas fa-baseball-ball"
    }
];

const LINEAR_SPEED_DRILLS = [
    {
        id: "spd_1",
        category: "Linear Speed & Acceleration Mechanics",
        name: "Wall Acceleration Drive Drills (45° Incline)",
        setsReps: "4 sets x 10 seconds",
        rest: "60s rest",
        focus: "Positive Shin Angle & Piston Leg Drive",
        notes: "Leaning into wall at 45 degrees, drive knees up toward chest with dorsiflexed toes, punching ground back and down.",
        videoPlaceholder: "fas fa-shield-alt"
    },
    {
        id: "spd_2",
        category: "Linear Speed & Acceleration Mechanics",
        name: "A-Skips & B-Skips Technique Rhythm",
        setsReps: "4 sets x 20 yards each",
        rest: "45s rest",
        focus: "Upright Sprint Gait & High Knee Recovery",
        notes: "Drive knee up high, snap foot down beneath hips. B-skip adds active hamstring claw-back extension.",
        videoPlaceholder: "fas fa-running"
    },
    {
        id: "spd_3",
        category: "Linear Speed & Acceleration Mechanics",
        name: "10-Yard Explosive Sled Push Bursts",
        setsReps: "6 reps x 10 yards",
        rest: "90s rest",
        focus: "Horizontal Force Application & First-3-Step Acceleration",
        notes: "Load sled with 50-70% bodyweight. Explode low out of stance with violent arm punch.",
        videoPlaceholder: "fas fa-truck-monster"
    },
    {
        id: "spd_4",
        category: "Linear Speed & Acceleration Mechanics",
        name: "Resisted Band Acceleration Starts",
        setsReps: "5 reps x 15 yards",
        rest: "90s rest",
        focus: "Overcoming Inertia & Low Heel Recovery",
        notes: "Partner holds heavy resistance band around hips. Sprint hard against resistance for 10 yards before band release.",
        videoPlaceholder: "fas fa-grip-lines"
    },
    {
        id: "spd_5",
        category: "Linear Speed & Acceleration Mechanics",
        name: "Flying 30-Meter Top Velocity Sprints",
        setsReps: "4 runs x 30m (20m build-up)",
        rest: "3 minutes rest",
        focus: "Maximal Absolute Velocity & Upright Posture",
        notes: "Gradually accelerate over 20m build-up zone, hit 100% top speed through 30m timing gate. Stay relaxed in shoulders.",
        videoPlaceholder: "fas fa-tachometer-alt"
    },
    {
        id: "spd_6",
        category: "Linear Speed & Acceleration Mechanics",
        name: "Arm Action Pumping Drill (Seated & Standing)",
        setsReps: "3 sets x 15 seconds max speed",
        rest: "45s rest",
        focus: "90° Elbow Angle & Sagittal Direct Swing",
        notes: "Sit upright on ground, pump arms violently from hip to chin without rotating shoulders. Eliminate cross-body drift.",
        videoPlaceholder: "fas fa-hand-rock"
    }
];

const COD_AGILITY_DRILLS = [
    {
        id: "cod_1",
        category: "Change of Direction (COD) & Agility Vectors",
        name: "Pro-Agility 5-10-5 Shuttle Run",
        setsReps: "5 runs",
        rest: "2 minutes rest",
        focus: "Lateral Deceleration & Rapid Pivot Transition",
        notes: "Start in 3-point stance. Burst 5 yards right, touch line with right hand, sprint 10 yards left, touch line, sprint 5 yards through center.",
        videoPlaceholder: "fas fa-random"
    },
    {
        id: "cod_2",
        category: "Change of Direction (COD) & Agility Vectors",
        name: "3-Cone L-Drill Matrix",
        setsReps: "4 runs (2 left turn, 2 right turn)",
        rest: "2 minutes rest",
        focus: "Tight Cornering, Plant-Foot Deceleration & Re-acceleration",
        notes: "Sprint 5 yards, touch line, return 5 yards. Round outside cone 1, weave inside cone 2, loop around cone 3, sprint home.",
        videoPlaceholder: "fas fa-route"
    },
    {
        id: "cod_3",
        category: "Change of Direction (COD) & Agility Vectors",
        name: "T-Drill Deceleration & Backpedal Matrix",
        setsReps: "4 runs",
        rest: "90s rest",
        focus: "Forward Sprint, Lateral Shuffle & Backpedal Mechanics",
        notes: "Sprint 10 yards forward, shuffle 5 yards left, shuffle 10 yards right, shuffle 5 yards to center, backpedal 10 yards through start line.",
        videoPlaceholder: "fas fa-th"
    },
    {
        id: "cod_4",
        category: "Change of Direction (COD) & Agility Vectors",
        name: "Crossover Lateral Shuttles",
        setsReps: "4 sets x 15 yards",
        rest: "60s rest",
        focus: "Frontal Plane Hip Crossover & Low Center of Mass",
        notes: "Cross trail leg over lead leg dynamically without rising up. Maintain low hip height and quick foot strike.",
        videoPlaceholder: "fas fa-shoe-prints"
    },
    {
        id: "cod_5",
        category: "Change of Direction (COD) & Agility Vectors",
        name: "Curved Figure-8 Sprint Slalom",
        setsReps: "4 sets x 2 complete laps",
        rest: "90s rest",
        focus: "Centripetal Force & Banking Body Lean",
        notes: "Set 2 cones 10 yards apart. Sprint tightly around cones in figure-8 pattern. Lean torso inward without dropping speed.",
        videoPlaceholder: "fas fa-infinity"
    },
    {
        id: "cod_6",
        category: "Change of Direction (COD) & Agility Vectors",
        name: "4-Square Reactive Cone Mirror Drill",
        setsReps: "4 sets x 12 seconds",
        rest: "90s rest",
        focus: "Visual Perception, Reaction Time & Sudden Foot Plant",
        notes: "Partner points to numbered cones. Instantly burst, break down hips, touch cone, and return to center stance.",
        videoPlaceholder: "fas fa-eye"
    }
];

const CONDITIONING_DRILLS = [
    {
        id: "cond_1",
        category: "Anaerobic Work Capacity & Lactic Conditioning",
        name: "4th Quarter 100-Meter Repeat Sprints",
        setsReps: "6-10 sets x 100 meters",
        rest: "1:5 Work-to-Rest Ratio (approx 60-75s)",
        focus: "Lactic Acid Buffering & High-Speed Work Capacity",
        notes: "Sprint 100m at 90-95% max velocity. Walk back during rest window. Focus on maintaining upright stride when fatigued.",
        videoPlaceholder: "fas fa-stopwatch"
    },
    {
        id: "cond_2",
        category: "Anaerobic Work Capacity & Lactic Conditioning",
        name: "Pyramid Shuttle Run (10-20-30-40 Yard Wave)",
        setsReps: "3 complete pyramids",
        rest: "2 minutes rest between pyramids",
        focus: "Multi-Distance Lactic Threshold & Mental Toughness",
        notes: "Sprint 10 yds and back, 20 yds and back, 30 yds and back, 40 yds and back continuously without stopping.",
        videoPlaceholder: "fas fa-align-left"
    },
    {
        id: "cond_3",
        category: "Anaerobic Work Capacity & Lactic Conditioning",
        name: "Sled Push Lactic Burnout Finisher",
        setsReps: "8 runs x 15 yards",
        rest: "45s rest",
        focus: "Anaerobic Glycolysis & Lower Body Muscular Endurance",
        notes: "Push heavy sled at maximum speed for 15 yards. Short 45-second rest enforces brutal lactic clearance adaptation.",
        videoPlaceholder: "fas fa-fire"
    },
    {
        id: "cond_4",
        category: "Anaerobic Work Capacity & Lactic Conditioning",
        name: "300-Yard Shuttle Challenge Test",
        setsReps: "2 sets x 300 yards (6 x 50yd legs)",
        rest: "5 minutes rest between sets",
        focus: "Peak Anaerobic Benchmark & Conditioning Audit",
        notes: "Set cones 25 yards apart. Sprint back and forth 6 times (300 total yards). Record completion time.",
        videoPlaceholder: "fas fa-trophy"
    },
    {
        id: "cond_5",
        category: "Anaerobic Work Capacity & Lactic Conditioning",
        name: "Aerobic Recovery 15s/15s Interval Matrix",
        setsReps: "2 blocks x 8 minutes (15s sprint / 15s jog)",
        rest: "3 minutes rest between blocks",
        focus: "Mitochondrial Density & VO2 Max Elevation",
        notes: "Alternate 15 seconds of high-tempo running with 15 seconds of easy recovery jog continuously for 8 minutes.",
        videoPlaceholder: "fas fa-heartbeat"
    }
];

const SPEED_CONDITIONING_BLUEPRINT = {
    title: "Speed, Agility & Conditioning E-Book Manual",
    subtitle: "Complete Athletic Performance Protocol • Mobility, Plyometrics, Speed Mechanics, COD Vectors & 4th Quarter Lactic Capacity",
    version: "2026.3",
    founder: "Ryan Brown, Owner & Founder of KROME Sports Performance",
    modules: [
        {
            id: "mod_mobility",
            name: "Dynamic Mobility & Movement Prep",
            icon: "fas fa-shoe-prints",
            color: "text-info",
            badge: "Prep & Activation",
            description: "Optimize joint dorsiflexion, hip flexor compliance, and dynamic neural activation to prepare tissue for high-velocity ground impact forces.",
            drills: SPEED_MOBILITY_DRILLS
        },
        {
            id: "mod_plyometrics",
            name: "Plyometrics & Kinetic Power",
            icon: "fas fa-bolt",
            color: "text-warning",
            badge: "Elasticity & Tendon Stiffness",
            description: "Develop low ground amortization time (< 0.12s), reactive tendon recoil, and stretch-shortening cycle rate of force development.",
            drills: PLYOMETRIC_DRILLS
        },
        {
            id: "mod_linear_speed",
            name: "Linear Speed & Acceleration Mechanics",
            icon: "fas fa-running",
            color: "text-success",
            badge: "First-Step Burst & Top Velocity",
            description: "Master 45-degree acceleration posture angles, positive shin drive, high toe recovery, and 100% max velocity flying mechanics.",
            drills: LINEAR_SPEED_DRILLS
        },
        {
            id: "mod_cod_agility",
            name: "Change of Direction (COD) & Agility Vectors",
            icon: "fas fa-random",
            color: "text-danger",
            badge: "Braking & Cutting Vectors",
            description: "Train decelerative plant-foot braking, low center of mass re-acceleration, multi-directional shuttle matrices, and reactive agility.",
            drills: COD_AGILITY_DRILLS
        },
        {
            id: "mod_conditioning",
            name: "Anaerobic Work Capacity & Lactic Conditioning",
            icon: "fas fa-fire",
            color: "text-warning",
            badge: "4th Quarter Lactic Threshold",
            description: "Build relentless repeat sprint ability and lactic acid buffering so you maintain peak explosive output through the final whistle.",
            drills: CONDITIONING_DRILLS
        }
    ],
    curriculumPhases: [
        {
            phase: 1,
            title: "Phase 1: Acceleration Foundations & Dynamic Plyometrics (Weeks 1-4)",
            focus: "Linear shin angles, 10-yd sled pushes, ankle pogo stiffness, wall acceleration mechanics.",
            daysPerWeek: 3,
            drills: ["mob_1", "mob_2", "plyo_1", "plyo_2", "spd_1", "spd_3", "cond_1"]
        },
        {
            phase: 2,
            title: "Phase 2: Lateral COD Vectoring & Kinetic Elasticity (Weeks 5-8)",
            focus: "Pro-agility 5-10-5, 3-cone L-drill, lateral hurdle bounds, depth jumps, crossover shuttles.",
            daysPerWeek: 3,
            drills: ["mob_3", "mob_4", "plyo_3", "plyo_5", "cod_1", "cod_2", "cod_4", "cond_2"]
        },
        {
            phase: 3,
            title: "Phase 3: Peak Top Velocity & Lactic Threshold Conditioning (Weeks 9-12)",
            focus: "Flying 30m sprints, reactive cone matrices, 300-yd shuttle challenge, sled burnout finishers.",
            daysPerWeek: 3,
            drills: ["mob_5", "plyo_4", "plyo_6", "spd_5", "cod_3", "cod_6", "cond_3", "cond_4"]
        }
    ],
    weeklySchedule: [
        // PHASE 1: WEEKS 1-4
        {
            week: 1,
            phase: 1,
            phaseName: "Phase 1: Acceleration Foundations & Plyometrics",
            title: "Week 1: First-Step Burst & Ankle Stiffness",
            objective: "Establish positive shin angles, ground contact elasticity, and initial lactic threshold capacity.",
            days: [
                {
                    dayNum: 1,
                    dayName: "Day 1: Linear Acceleration & Kinetic Elasticity",
                    focus: "First-step burst, positive shin angles & ankle stiffness",
                    warmup: ["mob_1", "mob_2"],
                    mainWorkout: [
                        { drillId: "plyo_1", prescribed: "4 sets x 15 reps", rest: "45s rest", note: "Keep ground contact under 0.12 seconds." },
                        { drillId: "spd_1", prescribed: "4 sets x 10 seconds", rest: "60s rest", note: "Maintain strict 45-degree acceleration incline." },
                        { drillId: "spd_3", prescribed: "6 reps x 10 yards", rest: "90s rest", note: "Explode low out of stance with violent arm punch." },
                        { drillId: "cond_1", prescribed: "6 sets x 100 meters", rest: "1:5 Work-Rest (60s)", note: "Sprint at 90-95% max velocity; walk back rest." }
                    ]
                },
                {
                    dayNum: 2,
                    dayName: "Day 2: Lateral Deceleration & Crossover Agility",
                    focus: "Frontal plane stability, hip mobility & lateral force absorption",
                    warmup: ["mob_3", "mob_4"],
                    mainWorkout: [
                        { drillId: "plyo_3", prescribed: "3 sets x 5 bounds/side", rest: "60s rest", note: "Stick landing for 2 seconds with knee tracking over toes." },
                        { drillId: "cod_4", prescribed: "4 sets x 15 yards", rest: "60s rest", note: "Cross trail leg over lead leg without rising up." },
                        { drillId: "spd_6", prescribed: "3 sets x 15 seconds", rest: "45s rest", note: "Seated arm pump drill; strict 90° elbow angle." },
                        { drillId: "cond_5", prescribed: "2 blocks x 8 min", rest: "3 minutes rest", note: "15s sprint / 15s jog continuous aerobic recovery." }
                    ]
                },
                {
                    dayNum: 3,
                    dayName: "Day 3: Force Acceptance & Resisted Bursts",
                    focus: "Rate of force development, toe dorsiflexion & lactic threshold",
                    warmup: ["mob_5", "mob_2"],
                    mainWorkout: [
                        { drillId: "plyo_2", prescribed: "4 sets x 5 reps", rest: "60s rest", note: "Snap down violently into athletic landing, then jump." },
                        { drillId: "spd_4", prescribed: "5 reps x 15 yards", rest: "90s rest", note: "Resisted band sprint; overcome inertia low." },
                        { drillId: "cond_2", prescribed: "3 complete pyramids", rest: "2 minutes rest", note: "10-20-30-40 yd sprint wave continuous." }
                    ]
                }
            ]
        },
        {
            week: 2,
            phase: 1,
            phaseName: "Phase 1: Acceleration Foundations & Plyometrics",
            title: "Week 2: Piston Stride Drive & Force Acceptance",
            objective: "Increase rate of force development during acceleration and reinforce midfoot strike mechanics.",
            days: [
                {
                    dayNum: 1,
                    dayName: "Day 1: Progressive Shin Incline & Pogo Stiffness",
                    focus: "Wall drives, ankle recoil & heavy sled push overload",
                    warmup: ["mob_1", "mob_3"],
                    mainWorkout: [
                        { drillId: "plyo_1", prescribed: "4 sets x 20 reps", rest: "45s rest", note: "Bounce exclusively off ball of foot with stiff ankles." },
                        { drillId: "spd_1", prescribed: "5 sets x 10 seconds", rest: "60s rest", note: "Punch ground back and down with dorsiflexed toes." },
                        { drillId: "spd_3", prescribed: "7 reps x 10 yards", rest: "90s rest", note: "Increase sled load to 60% bodyweight." },
                        { drillId: "cond_1", prescribed: "7 sets x 100 meters", rest: "1:5 Work-Rest (65s)", note: "Focus on maintaining posture under fatigue." }
                    ]
                },
                {
                    dayNum: 2,
                    dayName: "Day 2: Frontal Plane Control & Lateral Bounds",
                    focus: "Single-leg deceleration and hip adductor compliance",
                    warmup: ["mob_4", "mob_5"],
                    mainWorkout: [
                        { drillId: "plyo_3", prescribed: "4 sets x 5 bounds/side", rest: "60s rest", note: "Drive off inside edge of foot laterally." },
                        { drillId: "cod_4", prescribed: "5 sets x 15 yards", rest: "60s rest", note: "Maintain low center of mass throughout." },
                        { drillId: "spd_2", prescribed: "4 sets x 20 yards", rest: "45s rest", note: "A-skips and B-skips technique rhythm." },
                        { drillId: "cond_5", prescribed: "2 blocks x 8 min", rest: "3 minutes rest", note: "Maintain strict 15s sprint pacing." }
                    ]
                },
                {
                    dayNum: 3,
                    dayName: "Day 3: Resisted Burst & Acceleration Waves",
                    focus: "Explosive band-resisted starts & sprint pyramid conditioning",
                    warmup: ["mob_2", "mob_1"],
                    mainWorkout: [
                        { drillId: "plyo_2", prescribed: "5 sets x 5 reps", rest: "60s rest", note: "Maximum height on vertical jump off snap down." },
                        { drillId: "spd_4", prescribed: "6 reps x 15 yards", rest: "90s rest", note: "Release band at 10 yards to sprint free." },
                        { drillId: "cond_2", prescribed: "3 complete pyramids", rest: "2 minutes rest", note: "Touch lines cleanly on each shuttle turn." }
                    ]
                }
            ]
        },
        {
            week: 3,
            phase: 1,
            phaseName: "Phase 1: Acceleration Foundations & Plyometrics",
            title: "Week 3: Peak Acceleration Volume Overload",
            objective: "Maximal horizontal force application with high volume sprint interval clearing.",
            days: [
                {
                    dayNum: 1,
                    dayName: "Day 1: Max Acceleration Drive & Ankle Stiffness",
                    focus: "Piston leg drive and 100m repeat sprint density",
                    warmup: ["mob_1", "mob_2"],
                    mainWorkout: [
                        { drillId: "plyo_1", prescribed: "5 sets x 20 reps", rest: "45s rest", note: "Stiff ankles, zero ground contact delay." },
                        { drillId: "spd_1", prescribed: "5 sets x 12 seconds", rest: "60s rest", note: "Full 45° angle, piston knee drive." },
                        { drillId: "spd_3", prescribed: "8 reps x 10 yards", rest: "90s rest", note: "Heavy sled push bursts." },
                        { drillId: "cond_1", prescribed: "8 sets x 100 meters", rest: "1:5 Work-Rest (60s)", note: "Buffering lactic acid at 95% velocity." }
                    ]
                },
                {
                    dayNum: 2,
                    dayName: "Day 2: Unilateral Bounds & Dynamic Hip Prep",
                    focus: "Lateral power absorption and rapid crossover footwork",
                    warmup: ["mob_3", "mob_4"],
                    mainWorkout: [
                        { drillId: "plyo_3", prescribed: "4 sets x 6 bounds/side", rest: "60s rest", note: "Explosive sideways jump over hurdle." },
                        { drillId: "cod_4", prescribed: "5 sets x 20 yards", rest: "60s rest", note: "Fast hip crossover mechanics." },
                        { drillId: "spd_6", prescribed: "4 sets x 15 seconds", rest: "45s rest", note: "Seated arm drive at 100% cadence." },
                        { drillId: "cond_5", prescribed: "2 blocks x 10 min", rest: "3 minutes rest", note: "15s/15s aerobic recovery extension." }
                    ]
                },
                {
                    dayNum: 3,
                    dayName: "Day 3: Elastic Snap Downs & Resisted Acceleration",
                    focus: "Explosive stretch-shortening and sprint pyramid wave",
                    warmup: ["mob_5", "mob_1"],
                    mainWorkout: [
                        { drillId: "plyo_2", prescribed: "5 sets x 6 reps", rest: "60s rest", note: "Violent drop and immediate jump rebound." },
                        { drillId: "spd_4", prescribed: "6 reps x 20 yards", rest: "90s rest", note: "Heavy resistance band release." },
                        { drillId: "cond_2", prescribed: "4 complete pyramids", rest: "2 minutes rest", note: "10-20-30-40 yd sprint wave density." }
                    ]
                }
            ]
        },
        {
            week: 4,
            phase: 1,
            phaseName: "Phase 1: Acceleration Foundations & Plyometrics",
            title: "Week 4: Deload, Gait Audit & Baseline Combine Test",
            objective: "Neural recovery, posture alignment audit, and baseline 10/40-yard dash timing audit.",
            days: [
                {
                    dayNum: 1,
                    dayName: "Day 1: Technical Acceleration & Posture Audit",
                    focus: "Shin angle refinement and light pogo hops",
                    warmup: ["mob_1", "mob_2"],
                    mainWorkout: [
                        { drillId: "plyo_1", prescribed: "3 sets x 12 reps", rest: "60s rest", note: "Focus on crisp elastic bounce." },
                        { drillId: "spd_1", prescribed: "3 sets x 8 seconds", rest: "60s rest", note: "Refine 45° angle alignment." },
                        { drillId: "spd_2", prescribed: "4 sets x 20 yards", rest: "45s rest", note: "A-skips and B-skips form check." },
                        { drillId: "cond_1", prescribed: "4 sets x 100 meters", rest: "90s rest", note: "Easy 80% tempo stride." }
                    ]
                },
                {
                    dayNum: 2,
                    dayName: "Day 2: Mobility Flossing & Arm Action",
                    focus: "Joint decompression and dynamic neural flossing",
                    warmup: ["mob_3", "mob_4", "mob_5"],
                    mainWorkout: [
                        { drillId: "spd_6", prescribed: "3 sets x 15 seconds", rest: "45s rest", note: "Seated arm action pumping." },
                        { drillId: "cod_4", prescribed: "3 sets x 15 yards", rest: "60s rest", note: "Controlled lateral crossover." },
                        { drillId: "cond_5", prescribed: "1 block x 10 min", rest: "3 minutes rest", note: "Aerobic recovery flush." }
                    ]
                },
                {
                    dayNum: 3,
                    dayName: "Day 3: Baseline Combine Timing Test (10 & 40 Yd)",
                    focus: "Record baseline timing PRs and vertical jump benchmark",
                    warmup: ["mob_1", "mob_2", "mob_4"],
                    mainWorkout: [
                        { drillId: "plyo_2", prescribed: "3 sets x 3 reps", rest: "60s rest", note: "Neural activation snap downs." },
                        { drillId: "spd_3", prescribed: "3 reps x 10 yards", rest: "2 min rest", note: "Warm-up acceleration bursts." },
                        { drillId: "spd_5", prescribed: "3 timed runs x 40 yards", rest: "3 min rest", note: "Record 10-yd and 40-yd dash PR times in portal." }
                    ]
                }
            ]
        },

        // PHASE 2: WEEKS 5-8
        {
            week: 5,
            phase: 2,
            phaseName: "Phase 2: Lateral COD Vectoring & Kinetic Power",
            title: "Week 5: Deceleration Braking & Cutting Mechanics",
            objective: "Master plant-foot angle absorption, single-leg stability, and 5-10-5 shuttle agility.",
            days: [
                {
                    dayNum: 1,
                    dayName: "Day 1: Pro-Agility Shuttle & Split Scissor Power",
                    focus: "Lateral deceleration, plant foot angle & explosive scissor jumps",
                    warmup: ["mob_3", "mob_1"],
                    mainWorkout: [
                        { drillId: "plyo_4", prescribed: "3 sets x 6 jumps/side", rest: "60s rest", note: "Switch legs in mid-air, land smoothly." },
                        { drillId: "cod_1", prescribed: "5 runs (3-point stance)", rest: "2 minutes rest", note: "Plant outside foot firmly, drop hips on turn." },
                        { drillId: "spd_2", prescribed: "4 sets x 20 yards", rest: "45s rest", note: "A-skips and B-skips technique." },
                        { drillId: "cond_2", prescribed: "3 complete pyramids", rest: "2 minutes rest", note: "10-20-30-40 yard wave shuttle." }
                    ]
                },
                {
                    dayNum: 2,
                    dayName: "Day 2: 3-Cone L-Drill & Depth Jump Elasticity",
                    focus: "Tight cornering, reactive broad jumps & sled burnout",
                    warmup: ["mob_4", "mob_2"],
                    mainWorkout: [
                        { drillId: "plyo_5", prescribed: "4 sets x 4 reps", rest: "90s rest", note: "Step off 18-in box, bounce instantly into broad jump." },
                        { drillId: "cod_2", prescribed: "4 runs (2 L / 2 R)", rest: "2 minutes rest", note: "Weave tightly around cones without drifting wide." },
                        { drillId: "cond_3", prescribed: "6 runs x 15 yards", rest: "45s rest", note: "Sled push lactic burnout finisher." }
                    ]
                },
                {
                    dayNum: 3,
                    dayName: "Day 3: T-Drill Deceleration & Rotational Slams",
                    focus: "Forward, lateral & backpedal mechanics with core braking",
                    warmup: ["mob_5", "mob_3"],
                    mainWorkout: [
                        { drillId: "plyo_6", prescribed: "3 sets x 8 slams/side", rest: "60s rest", note: "Slam 10lb med ball hard into turf outside lead foot." },
                        { drillId: "cod_3", prescribed: "4 runs", rest: "90s rest", note: "Touch center cone on each shuttle change." },
                        { drillId: "cond_1", prescribed: "6 sets x 100 meters", rest: "60s rest", note: "1:5 Work-rest sprint buffering." }
                    ]
                }
            ]
        },
        {
            week: 6,
            phase: 2,
            phaseName: "Phase 2: Lateral COD Vectoring & Kinetic Power",
            title: "Week 6: Cornering Vectors & Centripetal Acceleration",
            objective: "Develop leaning torso banking during tight curves and high-speed lateral re-acceleration.",
            days: [
                {
                    dayNum: 1,
                    dayName: "Day 1: Figure-8 Slalom & Scissor Jump Power",
                    focus: "Centripetal banking lean & unilateral leg drive",
                    warmup: ["mob_4", "mob_1"],
                    mainWorkout: [
                        { drillId: "plyo_4", prescribed: "4 sets x 6 jumps/side", rest: "60s rest", note: "Explosive vertical displacement on scissor jump." },
                        { drillId: "cod_5", prescribed: "4 sets x 2 laps", rest: "90s rest", note: "Lean torso inward around cones without dropping speed." },
                        { drillId: "cod_1", prescribed: "4 runs (5-10-5)", rest: "2 minutes rest", note: "Focus on violent plant-foot turn." },
                        { drillId: "cond_2", prescribed: "3 complete pyramids", rest: "2 minutes rest", note: "Multi-distance lactic wave." }
                    ]
                },
                {
                    dayNum: 2,
                    dayName: "Day 2: Depth Jump Rebound & 3-Cone Matrix",
                    focus: "Eccentric absorption into maximal horizontal displacement",
                    warmup: ["mob_2", "mob_3"],
                    mainWorkout: [
                        { drillId: "plyo_5", prescribed: "4 sets x 4 reps", rest: "90s rest", note: "Minimal ground contact time off box." },
                        { drillId: "cod_2", prescribed: "4 runs", rest: "2 minutes rest", note: "Clean cornering around cone 2 & 3." },
                        { drillId: "cond_3", prescribed: "8 runs x 15 yards", rest: "45s rest", note: "Maximal effort sled push burnout." }
                    ]
                },
                {
                    dayNum: 3,
                    dayName: "Day 3: Rotational Core Slams & T-Drill Complex",
                    focus: "Transverse plane deceleration and backpedal speed",
                    warmup: ["mob_5", "mob_4"],
                    mainWorkout: [
                        { drillId: "plyo_6", prescribed: "4 sets x 8 slams/side", rest: "60s rest", note: "High overhead reach before violent slam." },
                        { drillId: "cod_3", prescribed: "5 runs", rest: "90s rest", note: "Low center of gravity during backpedal." },
                        { drillId: "cond_5", prescribed: "2 blocks x 8 min", rest: "3 minutes rest", note: "15s sprint / 15s jog recovery." }
                    ]
                }
            ]
        },
        {
            week: 7,
            phase: 2,
            phaseName: "Phase 2: Lateral COD Vectoring & Kinetic Power",
            title: "Week 7: Reactive Agility & Multi-Directional Overload",
            objective: "Sharpen visual reaction times, quick foot plant braking, and high-intensity shuttle capacity.",
            days: [
                {
                    dayNum: 1,
                    dayName: "Day 1: Reactive 4-Square Mirror & Pro-Agility",
                    focus: "Visual perception reaction and explosive direction change",
                    warmup: ["mob_1", "mob_3"],
                    mainWorkout: [
                        { drillId: "plyo_4", prescribed: "4 sets x 6 jumps/side", rest: "60s rest", note: "Maintain athletic knee alignment." },
                        { drillId: "cod_6", prescribed: "4 sets x 12 seconds", rest: "90s rest", note: "Partner points to cones; react instantly." },
                        { drillId: "cod_1", prescribed: "5 runs", rest: "2 minutes rest", note: "Full speed pro-agility shuttle." },
                        { drillId: "cond_1", prescribed: "8 sets x 100 meters", rest: "60s rest", note: "Buffering lactic acid at 95% velocity." }
                    ]
                },
                {
                    dayNum: 2,
                    dayName: "Day 2: Depth Jump Broad Rebound & Figure-8",
                    focus: "Horizontal elasticity and tight slalom cornering",
                    warmup: ["mob_4", "mob_2"],
                    mainWorkout: [
                        { drillId: "plyo_5", prescribed: "5 sets x 4 reps", rest: "90s rest", note: "Maximal horizontal broad jump distance." },
                        { drillId: "cod_5", prescribed: "4 sets x 2 laps", rest: "90s rest", note: "Banking body lean figure-8." },
                        { drillId: "cond_3", prescribed: "8 runs x 15 yards", rest: "45s rest", note: "Brutal lactic clearance on sled." }
                    ]
                },
                {
                    dayNum: 3,
                    dayName: "Day 3: Rotational Slams & 300-Yard Shuttle Prep",
                    focus: "Transverse braking and multi-leg shuttle capacity",
                    warmup: ["mob_5", "mob_1"],
                    mainWorkout: [
                        { drillId: "plyo_6", prescribed: "4 sets x 8 slams/side", rest: "60s rest", note: "Rotational core kinetic transfer." },
                        { drillId: "cod_3", prescribed: "4 runs", rest: "90s rest", note: "T-drill matrix execution." },
                        { drillId: "cond_4", prescribed: "1 set x 300 yards (6 x 50yd)", rest: "5 min rest", note: "Sub-60s 300yd shuttle target." }
                    ]
                }
            ]
        },
        {
            week: 8,
            phase: 2,
            phaseName: "Phase 2: Lateral COD Vectoring & Kinetic Power",
            title: "Week 8: Phase 2 Deload & Agility Benchmark Audit",
            objective: "Neural recovery for cutting joints and timing audit for Pro-Agility and 3-Cone L-Drill.",
            days: [
                {
                    dayNum: 1,
                    dayName: "Day 1: Technical Cutting Audit & Light Scissor Jumps",
                    focus: "Plant-foot angle inspection and sub-maximal footwork",
                    warmup: ["mob_3", "mob_4"],
                    mainWorkout: [
                        { drillId: "plyo_4", prescribed: "3 sets x 4 jumps/side", rest: "60s rest", note: "Controlled balance landing." },
                        { drillId: "cod_1", prescribed: "3 runs (75% speed)", rest: "90s rest", note: "Inspect outside plant foot 45° angle." },
                        { drillId: "cond_5", prescribed: "1 block x 10 min", rest: "3 min rest", note: "Aerobic recovery flush." }
                    ]
                },
                {
                    dayNum: 2,
                    dayName: "Day 2: Mobility Flossing & Curve Technique",
                    focus: "Adductor compliance and centripetal lean review",
                    warmup: ["mob_1", "mob_5"],
                    mainWorkout: [
                        { drillId: "cod_5", prescribed: "3 sets x 1 lap", rest: "60s rest", note: "Smooth figure-8 banking lean." },
                        { drillId: "spd_6", prescribed: "3 sets x 15 seconds", rest: "45s rest", note: "Seated arm action." }
                    ]
                },
                {
                    dayNum: 3,
                    dayName: "Day 3: Pro-Agility & 3-Cone Timing Audit",
                    focus: "Record agility benchmark PRs in portal",
                    warmup: ["mob_2", "mob_4"],
                    mainWorkout: [
                        { drillId: "plyo_3", prescribed: "3 sets x 4 bounds/side", rest: "60s rest", note: "Lateral elastic activation." },
                        { drillId: "cod_1", prescribed: "3 timed runs (5-10-5)", rest: "2 min rest", note: "Record best Pro-Agility time." },
                        { drillId: "cod_2", prescribed: "3 timed runs (3-Cone)", rest: "2 min rest", note: "Record best 3-Cone L-Drill time." }
                    ]
                }
            ]
        },

        // PHASE 3: WEEKS 9-12
        {
            week: 9,
            phase: 3,
            phaseName: "Phase 3: Peak Top Velocity & Lactic Conditioning",
            title: "Week 9: Flying 30m Top Speed & Absolute Velocity",
            objective: "Unlock max top velocity stride frequency with flying 30-meter sprints and arm action cadence.",
            days: [
                {
                    dayNum: 1,
                    dayName: "Day 1: Flying 30m Sprints & Ankle Pogo Bounce",
                    focus: "Upright max velocity posture and 100% top speed mechanics",
                    warmup: ["mob_1", "mob_2"],
                    mainWorkout: [
                        { drillId: "plyo_1", prescribed: "4 sets x 15 reps", rest: "45s rest", note: "Low ground amortization stiffness." },
                        { drillId: "spd_2", prescribed: "4 sets x 20 yards", rest: "45s rest", note: "A-skips and B-skips high knee recovery." },
                        { drillId: "spd_5", prescribed: "4 runs x 30m (20m build)", rest: "3 minutes rest", note: "Hit 100% max velocity through 30m timing gate." },
                        { drillId: "cond_1", prescribed: "8 sets x 100 meters", rest: "60s rest", note: "1:5 Work-rest repeat sprint conditioning." }
                    ]
                },
                {
                    dayNum: 2,
                    dayName: "Day 2: Rotational Slams & Reactive Agility Mirror",
                    focus: "Rotational core deceleration and visual reaction footwork",
                    warmup: ["mob_3", "mob_4"],
                    mainWorkout: [
                        { drillId: "plyo_6", prescribed: "3 sets x 8 slams/side", rest: "60s rest", note: "Kinetic chain transfer med ball slams." },
                        { drillId: "cod_6", prescribed: "4 sets x 12 seconds", rest: "90s rest", note: "4-square reactive cone mirror." },
                        { drillId: "cond_3", prescribed: "8 runs x 15 yards", rest: "45s rest", note: "Sled push lactic burnout finisher." }
                    ]
                },
                {
                    dayNum: 3,
                    dayName: "Day 3: 300-Yard Shuttle Challenge & Scissor Power",
                    focus: "Peak anaerobic work capacity and mental toughness",
                    warmup: ["mob_5", "mob_1"],
                    mainWorkout: [
                        { drillId: "plyo_4", prescribed: "4 sets x 6 jumps/side", rest: "60s rest", note: "Dynamic split-squat scissor jumps." },
                        { drillId: "spd_6", prescribed: "3 sets x 15 seconds", rest: "45s rest", note: "Max cadence arm pumping." },
                        { drillId: "cond_4", prescribed: "2 sets x 300 yards", rest: "5 minutes rest", note: "6 x 50yd shuttle legs. Record test time." }
                    ]
                }
            ]
        },
        {
            week: 10,
            phase: 3,
            phaseName: "Phase 3: Peak Top Velocity & Lactic Conditioning",
            title: "Week 10: Over-Speed Velocity & Lactic Buffering Overload",
            objective: "Maximize neurological firing rate and sustain peak velocity through 4th quarter fatigue.",
            days: [
                {
                    dayNum: 1,
                    dayName: "Day 1: Flying 30m Top Velocity & Arm Action Drive",
                    focus: "Maximal stride frequency, 90° arm swing & repeat sprint density",
                    warmup: ["mob_2", "mob_1"],
                    mainWorkout: [
                        { drillId: "spd_6", prescribed: "3 sets x 15 seconds", rest: "45s rest", note: "Seated arm drive at 100% speed." },
                        { drillId: "spd_5", prescribed: "5 runs x 30m (20m build)", rest: "3 minutes rest", note: "Smooth 20m acceleration, 100% max speed 30m gate." },
                        { drillId: "cond_1", prescribed: "9 sets x 100 meters", rest: "60s rest", note: "Maintain relaxed shoulders under fatigue." }
                    ]
                },
                {
                    dayNum: 2,
                    dayName: "Day 2: Reactive Agility & Heavy Sled Burnout",
                    focus: "Sudden foot plant reaction and anaerobic glycolysis burnout",
                    warmup: ["mob_3", "mob_5"],
                    mainWorkout: [
                        { drillId: "cod_6", prescribed: "5 sets x 12 seconds", rest: "90s rest", note: "Instant reaction to partner signals." },
                        { drillId: "cod_3", prescribed: "4 runs", rest: "90s rest", note: "T-drill matrix execution." },
                        { drillId: "cond_3", prescribed: "8 runs x 15 yards", rest: "45s rest", note: "Maximal sled push lactic clearance." }
                    ]
                },
                {
                    dayNum: 3,
                    dayName: "Day 3: Pyramid Shuttle Wave & Depth Jump Power",
                    focus: "Multi-distance lactic threshold and explosive horizontal displacement",
                    warmup: ["mob_4", "mob_2"],
                    mainWorkout: [
                        { drillId: "plyo_5", prescribed: "4 sets x 4 reps", rest: "90s rest", note: "Depth jump off box to broad jump." },
                        { drillId: "cond_2", prescribed: "4 complete pyramids", rest: "2 minutes rest", note: "10-20-30-40 yd sprint wave." },
                        { drillId: "cond_5", prescribed: "2 blocks x 8 min", rest: "3 minutes rest", note: "15s sprint / 15s jog aerobic recovery." }
                    ]
                }
            ]
        },
        {
            week: 11,
            phase: 3,
            phaseName: "Phase 3: Peak Top Velocity & Lactic Conditioning",
            title: "Week 11: Championship Work Capacity & Combine Sim",
            objective: "Peak physical conditioning simulation with high-intensity speed reps and 300yd shuttles.",
            days: [
                {
                    dayNum: 1,
                    dayName: "Day 1: Flying 30m Velocity & Pogo Stiffness",
                    focus: "Neurological speed priming and high knee recovery",
                    warmup: ["mob_1", "mob_2"],
                    mainWorkout: [
                        { drillId: "plyo_1", prescribed: "4 sets x 20 reps", rest: "45s rest", note: "Stiff ankle pogo bounce." },
                        { drillId: "spd_5", prescribed: "4 runs x 30m (20m build)", rest: "3 minutes rest", note: "Peak top velocity timing." },
                        { drillId: "cond_1", prescribed: "10 sets x 100 meters", rest: "60s rest", note: "Peak 100m repeat sprint volume." }
                    ]
                },
                {
                    dayNum: 2,
                    dayName: "Day 2: Reactive Mirroring & Sled Burnout",
                    focus: "Fast reactive footwork and final sled overload",
                    warmup: ["mob_3", "mob_4"],
                    mainWorkout: [
                        { drillId: "plyo_6", prescribed: "4 sets x 8 slams/side", rest: "60s rest", note: "Med ball rotational slams." },
                        { drillId: "cod_6", prescribed: "4 sets x 12 seconds", rest: "90s rest", note: "4-square reactive mirror." },
                        { drillId: "cond_3", prescribed: "8 runs x 15 yards", rest: "45s rest", note: "Brutal lactic clearance finisher." }
                    ]
                },
                {
                    dayNum: 3,
                    dayName: "Day 3: 300-Yard Shuttle Benchmark Simulation",
                    focus: "Final 300yd shuttle test benchmark before combine taper",
                    warmup: ["mob_5", "mob_1"],
                    mainWorkout: [
                        { drillId: "plyo_4", prescribed: "3 sets x 5 jumps/side", rest: "60s rest", note: "Split-squat scissor jumps." },
                        { drillId: "cond_4", prescribed: "2 sets x 300 yards", rest: "5 minutes rest", note: "Target sub-58s performance." }
                    ]
                }
            ]
        },
        {
            week: 12,
            phase: 3,
            phaseName: "Phase 3: Peak Top Velocity & Lactic Conditioning",
            title: "Week 12: Combine Taper & Final Performance Audit",
            objective: "Neural taper, CNS recovery, and official 10/40-Yard & Pro-Agility Combine Testing.",
            days: [
                {
                    dayNum: 1,
                    dayName: "Day 1: Speed Taper & Neural Primer",
                    focus: "Sub-maximal speed bursts and mobility activation",
                    warmup: ["mob_1", "mob_2"],
                    mainWorkout: [
                        { drillId: "plyo_1", prescribed: "3 sets x 10 reps", rest: "60s rest", note: "Light ankle bounce." },
                        { drillId: "spd_1", prescribed: "3 sets x 6 seconds", rest: "60s rest", note: "45° wall drive primer." },
                        { drillId: "spd_3", prescribed: "3 reps x 10 yards", rest: "90s rest", note: "Light sled push bursts." }
                    ]
                },
                {
                    dayNum: 2,
                    dayName: "Day 2: Mobility Decompression & Stride Rhythm",
                    focus: "Full dynamic mobility prep and joint flossing",
                    warmup: ["mob_3", "mob_4", "mob_5"],
                    mainWorkout: [
                        { drillId: "spd_2", prescribed: "3 sets x 20 yards", rest: "45s rest", note: "A-skips and B-skips rhythm." },
                        { drillId: "spd_6", prescribed: "3 sets x 10 seconds", rest: "45s rest", note: "Seated arm pump." }
                    ]
                },
                {
                    dayNum: 3,
                    dayName: "Day 3: OFFICIAL KROME ATHLETIC COMBINE AUDIT",
                    focus: "Execute official combine PR test suite & sync profile",
                    warmup: ["mob_1", "mob_2", "mob_4"],
                    mainWorkout: [
                        { drillId: "spd_3", prescribed: "2 warm-up bursts", rest: "2 min rest", note: "First-step burst activation." },
                        { drillId: "spd_5", prescribed: "3 timed runs x 40 yards", rest: "3 min rest", note: "Record official 10-yd and 40-yd dash PRs!" },
                        { drillId: "cod_1", prescribed: "2 timed runs x Pro-Agility", rest: "3 min rest", note: "Record official 5-10-5 shuttle PR!" },
                        { drillId: "plyo_2", prescribed: "3 max vertical jumps", rest: "2 min rest", note: "Record official Vertical Jump PR!" }
                    ]
                }
            ]
        }
    ],

    gaitChecklist: [
        {
            id: "chk_posture",
            title: "Acceleration Torso Angle",
            description: "Maintain a straight line from ear to ankle at a 45-degree angle during first 3 steps (do not bend at waist)."
        },
        {
            id: "chk_arms",
            title: "Arm Action & Elbow Flexion",
            description: "Maintain strict 90-degree elbow flexion. Drive hands violently from hip to chin with zero cross-body rotation."
        },
        {
            id: "chk_footstrike",
            title: "Midfoot Ground Strike",
            description: "Foot lands directly underneath center of gravity on ball of foot. Avoid heel-striking or over-striding."
        },
        {
            id: "chk_shin",
            title: "Positive Shin Incline",
            description: "Knee drives forward with toe dorsiflexed (pulled up to shin), creating a positive shin angle to drive horizontal force."
        },
        {
            id: "chk_braking",
            title: "Deceleration Plant Foot Angle",
            description: "When cutting, lower center of mass, drop hips, and plant outside foot at 45° to absorb force safely before re-accelerating."
        }
    ]
};

if (typeof window !== 'undefined') {
    window.SPEED_CONDITIONING_BLUEPRINT = SPEED_CONDITIONING_BLUEPRINT;
}
