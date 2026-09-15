/**
 * KROME Sports Performance - Flexibility & Mobility E-Book Blueprint Data
 * Complete Movement, Joint Decompression & Neuromuscular Recovery Curriculum
 */

const FLEXMOB_DRILL_LIBRARY = [
    // --- SPINAL & THORACIC DECOMPRESSION ---
    {
        id: "flex_1",
        category: "Spinal & Thoracic",
        name: "Thoracic Spine Extension Over Foam Roller",
        setsReps: "3 sets x 60 sec holds",
        rest: "45s rest",
        focus: "Thoracic Kyphosis Reset & Rib Cage Expansion",
        notes: "Support head with hands, interlock fingers, pull elbows together. Arc upper back over roller, breathe deeply into belly. Do not arch lower back.",
        icon: "fas fa-bone"
    },
    {
        id: "flex_2",
        category: "Spinal & Thoracic",
        name: "Cat-Cow Neuromuscular Segmentations",
        setsReps: "2 sets x 10 slow cycles",
        rest: "30s rest",
        focus: "Segmental Vertebral Control & Spinal Fluidity",
        notes: "Move one vertebra at a time starting from tailbone up to neck. Hold maximum flexion for 2 seconds, then slowly reverse into extension.",
        icon: "fas fa-cat"
    },
    {
        id: "flex_3",
        category: "Spinal & Thoracic",
        name: "Thread-the-Needle Scapular Opener",
        setsReps: "2 sets x 10 reps/side",
        rest: "30s rest",
        focus: "Thoracic Rotation & Rhomboid/Rear Deltoid Decompression",
        notes: "On quadruped position, slide one arm under body reaching far opposite. Rotate torso open and reach top hand up toward ceiling.",
        icon: "fas fa-arrows-alt"
    },
    {
        id: "flex_4",
        category: "Spinal & Thoracic",
        name: "Spinal Decompression Bar Hang",
        setsReps: "3 sets x 60-90 sec holds",
        rest: "60s rest",
        focus: "Intervertebral Disc Decompression & Lat lengthening",
        notes: "Hang from pull-up bar with relaxed lower body. Focus on diaphragmatic breathing to open up space between lumbar vertebrae.",
        icon: "fas fa-grip-lines-vertical"
    },

    // --- HIPS & PELVIC GIRDLE ---
    {
        id: "flex_5",
        category: "Hips & Pelvic Girdle",
        name: "90-90 Hip Internal & External Rotations",
        setsReps: "3 sets x 2 mins/side",
        rest: "45s rest",
        focus: "Capsular Hip Mobility & Gluteus Medius Lengthening",
        notes: "Maintain tall upright spine. Lean torso forward over front shin for external rotation stretch, then rotate chest toward back leg for internal rotation.",
        icon: "fas fa-sync"
    },
    {
        id: "flex_6",
        category: "Hips & Pelvic Girdle",
        name: "Couch Quad & Psoas Decompression",
        setsReps: "3 sets x 90 sec/side",
        rest: "45s rest",
        focus: "Anterior Chain Lengthening & Rectus Femoris Extension",
        notes: "Back shin flush against wall. Squeeze rear glute tightly to drive hip forward. Keep torso upright without hyperextending lower spine.",
        icon: "fas fa-couch"
    },
    {
        id: "flex_7",
        category: "Hips & Pelvic Girdle",
        name: "Frog Stretch Adductor Opener",
        setsReps: "3 sets x 2 mins hold",
        rest: "45s rest",
        focus: "Groin, Adductor Longus & Pelvic Floor Relief",
        notes: "Knees wide on mat, feet turned outward. Gently rock hips backward toward heels while maintaining flat lumbar spine.",
        icon: "fas fa-frog"
    },
    {
        id: "flex_8",
        category: "Hips & Pelvic Girdle",
        name: "Pigeon Pose with Active Reach",
        setsReps: "3 sets x 2 mins/side",
        rest: "45s rest",
        focus: "Deep Gluteus Maximus & Piriformis Release",
        notes: "Front knee folded at 45 to 90 degrees. Sink pelvis vertically toward floor. Reach arms straight forward to intensify lateral hip stretch.",
        icon: "fas fa-pray"
    },
    {
        id: "flex_9",
        category: "Hips & Pelvic Girdle",
        name: "Shin Box Extension to Hip Opener",
        setsReps: "2 sets x 8 reps/side",
        rest: "30s rest",
        focus: "Dynamic Hip Extension & Glute Activation",
        notes: "From 90-90 sitting position, drive knees into floor and extend hips upright into tall kneeling. Lower under control.",
        icon: "fas fa-box"
    },

    // --- ANKLES & LOWER EXTREMITIES ---
    {
        id: "flex_10",
        category: "Ankles & Lower Extremities",
        name: "Ankle Dorsiflexion Wall-Drive Holds",
        setsReps: "3 sets x 45 sec/side",
        rest: "30s rest",
        focus: "Achilles Tendon Stiffness & Soleus Flexibility",
        notes: "Foot 4 inches from wall. Push knee forward over 2nd toe while pressing heel down. Essential for deep squatting and acceleration angles.",
        icon: "fas fa-shoe-prints"
    },
    {
        id: "flex_11",
        category: "Ankles & Lower Extremities",
        name: "Active Hamstring Neural Flossing",
        setsReps: "3 sets x 12 reps/side",
        rest: "30s rest",
        focus: "Sciatic Nerve Glide & Posterior Chain Fluidity",
        notes: "Lying on back with thigh held at 90 degrees. Extend knee upwards while flexing foot up, then bend knee as foot points down.",
        icon: "fas fa-wave-square"
    },
    {
        id: "flex_12",
        category: "Ankles & Lower Extremities",
        name: "Knee-Over-Toe Lunge Decompression",
        setsReps: "3 sets x 10 reps/side",
        rest: "30s rest",
        focus: "VMO Strengthening & Patellar Tendon Health",
        notes: "Drive front knee completely forward over toes until hamstring covers calf. Keep rear leg straight and tall.",
        icon: "fas fa-walking"
    },

    // --- SHOULDERS & SCAPULAR COMPLEX ---
    {
        id: "flex_13",
        category: "Shoulder & Scapular",
        name: "Prone Shoulder Swimmers (Controlled Articular Rotations)",
        setsReps: "3 sets x 6 slow reps",
        rest: "45s rest",
        focus: "Rotator Cuff End-Range Mobility & Scapular Independence",
        notes: "Lying face down with hands behind head. Lift hands, straighten overhead, sweep out and behind lower back without touching floor.",
        icon: "fas fa-swimmer"
    },
    {
        id: "flex_14",
        category: "Shoulder & Scapular",
        name: "Scapular Wall Slides with Foam Roller",
        setsReps: "3 sets x 12 reps",
        rest: "30s rest",
        focus: "Serratus Anterior Activation & Upward Scapular Rotation",
        notes: "Forearms against foam roller on wall. Slide arms vertically up while keeping chin tucked and ribs pulled down.",
        icon: "fas fa-border-all"
    },
    {
        id: "flex_15",
        category: "Shoulder & Scapular",
        name: "Overhead Prayer Lat Stretch",
        setsReps: "3 sets x 60 sec holds",
        rest: "30s rest",
        focus: "Latissimus Dorsi & Posterior Capsule Lengthening",
        notes: "Elbows resting on bench, hands together holding stick. Drop chest to floor and breathe into upper back.",
        icon: "fas fa-hands"
    },

    // --- END-RANGE ISOMETRICS & PAILs / RAILs ---
    {
        id: "flex_16",
        category: "End-Range Isometrics",
        name: "Hip External Rotation PAILs / RAILs",
        setsReps: "3 cycles per side",
        rest: "60s rest",
        focus: "Neural Range Ownership & Active End-Range Tension",
        notes: "Hold passive stretch 2 min. PAILs: Press front ankle into ground with 20%-100% effort (10s). RAILs: Try to actively lift ankle off ground (10s).",
        icon: "fas fa-bolt"
    },
    {
        id: "flex_17",
        category: "End-Range Isometrics",
        name: "Jefferson Curl Loaded Eccentric Segmentations",
        setsReps: "3 sets x 8 reps (light dumbbell/plate)",
        rest: "60s rest",
        focus: "Posterior Chain Tensile Strength & Segmental Spine Flexibility",
        notes: "Stand on box. Tuck chin, roll down one vertebra at a time allowing light weight to pull hands toward toes. Pause bottom 3s, roll back up.",
        icon: "fas fa-weight-hanging"
    },
    {
        id: "flex_18",
        category: "End-Range Isometrics",
        name: "Cossack Side Squat Isometric Transfers",
        setsReps: "3 sets x 8 reps/side",
        rest: "45s rest",
        focus: "Deep Adductor End-Range Strength & Ankle Dorsiflexion",
        notes: "Squat deep to one side keeping lead heel down and opposite toe pointed up. Shift low across to opposite side without standing up.",
        icon: "fas fa-arrows-alt-h"
    }
];

const FLEXMOB_TRACKS = {
    athletic_prep: {
        id: "athletic_prep",
        title: "Athletic Dynamic Prep & Joint Longevity Track",
        tagline: "8-Week Blueprint for High-Performance Movement, Pre-Workout Prep & Daily Joint Health",
        phases: [
            {
                phaseNum: 1,
                title: "Phase 1: Spinal & Pelvic Decompression (Weeks 1-2)",
                focus: "Decompress lower lumbar discs, unlock over-tight hip flexors, and open thoracic rotation.",
                days: [
                    {
                        id: "p1d1",
                        dayName: "Day 1: Hip & Thoracic Decompression",
                        subtitle: "Focus: Lower Body Joint Space & Upper Back Rotation",
                        modules: [
                            {
                                category: "Spinal & Thoracic Decompression",
                                defaultSetsReps: "2-3 Sets",
                                items: [
                                    { name: "Thoracic Spine Extension Over Foam Roller", setsReps: "3 sets x 60 sec", rest: "45s", notes: "Arc upper back over roller, breathe deeply into belly." },
                                    { name: "Thread-the-Needle Scapular Opener", setsReps: "2 sets x 10 reps/side", rest: "30s", notes: "Rotate torso open and reach top hand up toward sky." },
                                    { name: "Spinal Decompression Bar Hang", setsReps: "3 sets x 60 sec", rest: "60s", notes: "Hang relaxed, diaphragmatic nasal breathing." }
                                ]
                            },
                            {
                                category: "Hip & Pelvic Mobility",
                                defaultSetsReps: "2-3 Sets",
                                items: [
                                    { name: "90-90 Hip Internal & External Rotations", setsReps: "3 sets x 2 mins/side", rest: "45s", notes: "Lean torso over front shin with tall spine." },
                                    { name: "Couch Quad & Psoas Decompression", setsReps: "3 sets x 90 sec/side", rest: "45s", notes: "Squeeze rear glute tightly to drive hip forward." },
                                    { name: "Frog Stretch Adductor Opener", setsReps: "3 sets x 2 mins hold", rest: "45s", notes: "Knees wide, rock hips backward toward heels." }
                                ]
                            }
                        ]
                    },
                    {
                        id: "p1d2",
                        dayName: "Day 2: Ankle & Posterior Chain Lengthening",
                        subtitle: "Focus: Achilles Tendon Compliance & Sciatic Neural Flossing",
                        modules: [
                            {
                                category: "Ankle & Foot Mechanics",
                                defaultSetsReps: "3 Sets",
                                items: [
                                    { name: "Ankle Dorsiflexion Wall-Drive Holds", setsReps: "3 sets x 45 sec/side", rest: "30s", notes: "Drive knee past toes keeping heel firmly grounded." },
                                    { name: "Knee-Over-Toe Lunge Decompression", setsReps: "3 sets x 10 reps/side", rest: "30s", notes: "Cover calf with hamstring for VMO and patellar health." }
                                ]
                            },
                            {
                                category: "Posterior Chain Glides",
                                defaultSetsReps: "3 Sets",
                                items: [
                                    { name: "Active Hamstring Neural Flossing", setsReps: "3 sets x 12 reps/side", rest: "30s", notes: "Flex/extend ankle while flexing knee for sciatic glide." },
                                    { name: "Pigeon Pose with Active Reach", setsReps: "3 sets x 2 mins/side", rest: "45s", notes: "Reach arms straight forward to open piriformis." }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                phaseNum: 2,
                title: "Phase 2: Dynamic 3D Movement & Rotation (Weeks 3-4)",
                focus: "Transition static ROM into dynamic multi-planar mobility for multi-directional speed and change of direction.",
                days: [
                    {
                        id: "p2d1",
                        dayName: "Day 1: Rotational Hip & Scapular Flow",
                        subtitle: "Focus: 3D Multi-Planar Hip Expansion & Scapular Rhythm",
                        modules: [
                            {
                                category: "Rotational Mobility",
                                defaultSetsReps: "3 Sets",
                                items: [
                                    { name: "Shin Box Extension to Hip Opener", setsReps: "3 sets x 8 reps/side", rest: "30s", notes: "Drive knees into floor and extend hips into tall kneeling." },
                                    { name: "Cat-Cow Neuromuscular Segmentations", setsReps: "3 sets x 10 slow cycles", rest: "30s", notes: "Move one vertebra at a time starting from tailbone." },
                                    { name: "Cossack Side Squat Switches", setsReps: "3 sets x 8 reps/side", rest: "45s", notes: "Stay low in hip crease when transitioning side to side." }
                                ]
                            },
                            {
                                category: "Scapular & Shoulder Rhythm",
                                defaultSetsReps: "3 Sets",
                                items: [
                                    { name: "Prone Shoulder Swimmers", setsReps: "3 sets x 6 slow reps", rest: "45s", notes: "Sweep arms from lower back to overhead without touching floor." },
                                    { name: "Scapular Wall Slides with Foam Roller", setsReps: "3 sets x 12 reps", rest: "30s", notes: "Keep forearms flush, slide vertically without arching back." }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                phaseNum: 3,
                title: "Phase 3: Active End-Range Joint Strengthening (Weeks 5-6)",
                focus: "Build neural control, active tension, and loaded stability at extreme joint angles to bulletproof soft tissues.",
                days: [
                    {
                        id: "p3d1",
                        dayName: "Day 1: PAILs / RAILs Isometric End-Range Control",
                        subtitle: "Focus: Active End-Range Tension & Neuromuscular Ownership",
                        modules: [
                            {
                                category: "End-Range Isometrics",
                                defaultSetsReps: "3 Cycles",
                                items: [
                                    { name: "Hip External Rotation PAILs / RAILs", setsReps: "3 cycles per side", rest: "60s", notes: "10s PAILs push down into floor, 10s RAILs pull up." },
                                    { name: "Jefferson Curl Loaded Eccentric Rollouts", setsReps: "3 sets x 8 reps", rest: "60s", notes: "Segmental roll down with light dumbbell over box edge." }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                phaseNum: 4,
                title: "Phase 4: Complete Tissue Restoration & Down-Regulation (Weeks 7-8)",
                focus: "Parasympathetic respiratory down-regulation, fascial hydration release, and peak recovery state.",
                days: [
                    {
                        id: "p4d1",
                        dayName: "Day 1: Neuromuscular Parasympathetic Reset",
                        subtitle: "Focus: Long-Hold Fascia Release & 4-4-8 Respiratory Flow",
                        modules: [
                            {
                                category: "Fascial Lengthening",
                                defaultSetsReps: "Long Holds",
                                items: [
                                    { name: "Overhead Prayer Lat Stretch", setsReps: "3 sets x 90 sec", rest: "30s", notes: "Sink chest into floor with elbows elevated on bench." },
                                    { name: "Pigeon Pose with Deep Nasal Breathing", setsReps: "3 sets x 3 mins/side", rest: "45s", notes: "Maintain 4-4-8 parasympathetic respiratory rhythm." },
                                    { name: "Spinal Decompression Bar Hang", setsReps: "3 sets x 90 sec", rest: "60s", notes: "Total lower body relaxation, un-weighting lumbar discs." }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },

    deep_recovery: {
        id: "deep_recovery",
        title: "Deep Tissue Decompression & Parasympathetic Recovery Track",
        tagline: "8-Week Clinical Protocol for Post-Training Recovery, Fascial Lengthening & CNS Down-Regulation",
        phases: [
            {
                phaseNum: 1,
                title: "Phase 1: Fascial Hydration & Capsule Unweighting (Weeks 1-2)",
                focus: "Unlock thick fascial adhesions in lower back, hamstrings, and hip capsule.",
                days: [
                    {
                        id: "dr_p1d1",
                        dayName: "Day 1: Full-Body Fascial Release",
                        subtitle: "Focus: Decompressing Axial Spine & Hip Rotators",
                        modules: [
                            {
                                category: "Capsular Decompression",
                                defaultSetsReps: "3 Sets",
                                items: [
                                    { name: "Spinal Decompression Bar Hang", setsReps: "3 sets x 90 sec", rest: "60s", notes: "Un-weight spine, relax pelvic girdle completely." },
                                    { name: "90-90 Hip Internal & External Rotations", setsReps: "3 sets x 2 mins/side", rest: "45s", notes: "Continuous slow torso leans over front & back legs." },
                                    { name: "Frog Stretch Adductor Opener", setsReps: "3 sets x 2 mins", rest: "45s", notes: "Breathe through diaphragmatic exhalations." }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                phaseNum: 2,
                title: "Phase 2: Loaded Mobility & Eccentric Lengthening (Weeks 3-4)",
                focus: "Strengthen tendons through full eccentric ROM to prevent soft tissue strains.",
                days: [
                    {
                        id: "dr_p2d1",
                        dayName: "Day 1: Loaded Tendon Adaptation",
                        subtitle: "Focus: Jefferson Curls, Cossack Squats & Ankle Drives",
                        modules: [
                            {
                                category: "Loaded Eccentrics",
                                defaultSetsReps: "3 Sets",
                                items: [
                                    { name: "Jefferson Curl Loaded Eccentric Rollouts", setsReps: "3 sets x 10 reps", rest: "60s", notes: "Segmental vertebral roll with light plate." },
                                    { name: "Cossack Side Squat Isometric Transfers", setsReps: "3 sets x 8 reps/side", rest: "45s", notes: "Pause 2s in bottom deep stretch per side." },
                                    { name: "Ankle Dorsiflexion Wall-Drive Holds", setsReps: "3 sets x 60 sec/side", rest: "30s", notes: "Heavy isometric wall drive past toe line." }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                phaseNum: 3,
                title: "Phase 3: High-Tension PAILs / RAILs End-Range Control (Weeks 5-6)",
                focus: "Maximal isometric contractions at end-range to increase usable mobility.",
                days: [
                    {
                        id: "dr_p3d1",
                        dayName: "Day 1: Maximum Effort Isometric End-Range",
                        subtitle: "Focus: Neural Adaptation at Max Joint Angles",
                        modules: [
                            {
                                category: "PAILs / RAILs Workouts",
                                defaultSetsReps: "3 Cycles",
                                items: [
                                    { name: "Hip External Rotation PAILs / RAILs", setsReps: "3 cycles per side", rest: "60s", notes: "Press down 100% effort 10s, pull up 100% effort 10s." },
                                    { name: "Prone Shoulder Swimmers", setsReps: "3 sets x 8 reps", rest: "45s", notes: "Strict scapular rotation without touching ground." }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                phaseNum: 4,
                title: "Phase 4: Clinical Parasympathetic CNS Reset (Weeks 7-8)",
                focus: "Vagal nerve stimulation, 4-4-8 respiratory down-regulation, and systemic CNS recovery.",
                days: [
                    {
                        id: "dr_p4d1",
                        dayName: "Day 1: Ultimate Recovery & Vagal Tone Flow",
                        subtitle: "Focus: Post-Competition Decompression & Deep Sleep Prep",
                        modules: [
                            {
                                category: "Parasympathetic Down-Regulation",
                                defaultSetsReps: "3-4 Mins Hold",
                                items: [
                                    { name: "Couch Quad & Psoas Decompression", setsReps: "3 sets x 2 mins/side", rest: "30s", notes: "Relax jaw and facial muscles during deep stretch." },
                                    { name: "Pigeon Pose with Deep Nasal Breathing", setsReps: "3 sets x 3 mins/side", rest: "30s", notes: "Sync with 4-4-8 breath pacer for vagal activation." },
                                    { name: "Spinal Decompression Bar Hang", setsReps: "3 sets x 90 sec", rest: "60s", notes: "Complete muscular release from jaw to ankles." }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

const FLEXMOB_ASSESSMENTS = [
    {
        id: "assess_1",
        name: "Ankle Knee-to-Wall Dorsiflexion Test",
        target: "Ankle Mobility",
        benchmark: ">= 4 to 5 inches from wall without heel lifting",
        cue: "Measure distance between big toe and wall while keeping heel flat and touching knee to wall."
    },
    {
        id: "assess_2",
        name: "90-90 Hip Internal & External Rotation Test",
        target: "Hip Capsule & Rotators",
        benchmark: "Torso flush over front shin without hip hiking or back rounding",
        cue: "Sit in 90-90. Test if front shin can rest flat and back knee can press firmly to floor."
    },
    {
        id: "assess_3",
        name: "Thoracic Spine Wall Rotation Clearance",
        target: "Thoracic Spine Rotation",
        benchmark: "Back of both shoulders touch wall smoothly during kneeling rotation",
        cue: "Kneel side to wall with inside leg up against wall. Rotate outside arm 180 degrees to wall."
    },
    {
        id: "assess_4",
        name: "Overhead Deep Squat Shoulder Clearance",
        target: "Ankle, Hip & Lat Overhead Mobility",
        benchmark: "Arms stay parallel to torso angle in bottom squat",
        cue: "Hold wooden dowel overhead, squat deep without heels rising or chest caving."
    }
];
