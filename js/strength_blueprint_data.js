/**
 * KROME Sports Performance
 * Strength & Power E-Book Blueprint Data Model
 * 4-Day High-Performance Athlete Curriculum
 */

const ATHLETIC_FORCE_DAYS = [
        {
            id: 1,
            name: "Day 1",
            title: "Lower Body Strength & Olympic Progressions",
            focus: "Squat Wave Loading (65-75%), Clean Technique, Upper Pull & Kinetic Core",
            modules: [
                {
                    category: "Mobility",
                    defaultSetsReps: "1 set x 30 sec",
                    items: [
                        { name: "90/90 Reach Overs", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Pelvic & hip capsule rotation" },
                        { name: "Prone T-Spine Rotation", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Thoracic spine extension" },
                        { name: "3 Point T-Spine Rotation", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Open chest & ribcage" },
                        { name: "WGS Progression - Hip Flexor / T-Spine / Hamstring", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "World's Greatest Stretch full chain" },
                        { name: "Hip Rotations", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Controlled articular rotations" },
                        { name: "Kickbacks", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Gluteus maximus activation" },
                        { name: "Sumo Overhead Reach", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Adductors & lat expansion" },
                        { name: "Ankle Rotations", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Dorsiflexion preparation" }
                    ]
                },
                {
                    category: "Team Lift Prep (Neuro-activation)",
                    defaultSetsReps: "1 set x 5",
                    items: [
                        { name: "Bodyweight Squat", setsReps: "1 set x 5", load: "Bodyweight", notes: "Drive knees out, chest tall" },
                        { name: "Lateral Shuffles (slow & low)", setsReps: "1 set x 5 yds/side", load: "Bodyweight", notes: "Stay in universal athletic position" },
                        { name: "Supine Hamstring Pullback Release", setsReps: "1 set x 5 each", load: "Bodyweight", notes: "Active reciprocal inhibition" },
                        { name: "Single Leg Glute Bridges", setsReps: "1 set x 5 each", load: "Bodyweight", notes: "2-sec pause at peak extension" }
                    ]
                },
                {
                    category: "Power Skill (Olympic progressions)",
                    defaultSetsReps: "3 x 2",
                    items: [
                        { name: "Power Clean Set Up (All Together)", setsReps: "3 x 2", load: "Technique Bar / Empty Bar", notes: "Hook grip, lats locked, hips back" },
                        { name: "Lift Off / Hold / 1st Pull", setsReps: "3 x 2", load: "Moderate / Controlled", notes: "Sweep bar back to thighs, maintain spine" },
                        { name: "Band Overhead Squat", setsReps: "3 x 2", load: "Resistance Band", notes: "Shoulder stability & core uprightness" }
                    ]
                },
                {
                    category: "Push Lower",
                    defaultSetsReps: "",
                    items: [
                        { name: "Squat", setsReps: "4 x 6", load: "65 / 70 / 75 / 75 %", notes: "Primary compound: auto-calculated from your 1RM", is1RMCalc: true, calcType: "squat", wave: [0.65, 0.70, 0.75, 0.75] },
                        { name: "Bird Dog Row", setsReps: "3 x 6", load: "DB / KB", notes: "Anti-rotational core & upper back" },
                        { name: "Y’s", setsReps: "3 x 6", load: "Light plates / Band", notes: "Lower trap & posterior deltoid retraction" },
                        { name: "Wall T-Spine", setsReps: "3 x 6", load: "Bodyweight", notes: "Maintain lumbar contact against wall" }
                    ]
                },
                {
                    category: "Pull Upper",
                    defaultSetsReps: "",
                    items: [
                        { name: "Bar Rows", setsReps: "4 x 6", load: "Barbell", notes: "Pull to sternum, squeeze lats", is1RMCalc: true, calcType: "row", wave: [0.65, 0.70, 0.75, 0.75] },
                        { name: "Contralateral Lateral Step Ups", setsReps: "3 x 6 each", load: "DB / KB", notes: "Drive knee high, control eccentric descent" },
                        { name: "Band Lat Pulls", setsReps: "3 x 8", load: "Heavy Band", notes: "Full lat engagement & scaps depressed" },
                        { name: "Band Lat Stretch", setsReps: "3 x 30 sec", load: "Band", notes: "Decompress thoracic cage & shoulders" }
                    ]
                },
                {
                    category: "ESD (Energy System Development)",
                    defaultSetsReps: "2 x 30 sec",
                    items: [
                        { name: "Med Ball Chops", setsReps: "2 x 30 sec", load: "8-12 lbs", notes: "Explosive diagonal torque & hip rotation" },
                        { name: "Med Ball Slams", setsReps: "2 x 30 sec", load: "10-15 lbs", notes: "Triple extension down to explosive ground slam" },
                        { name: "Farmers Marches", setsReps: "2 x 30 sec", load: "Heavy DBs / KBs", notes: "High knee drive with rigid posture" },
                        { name: "Chest Pass + Rotational Toss", setsReps: "2 x 30 sec", load: "Med Ball", notes: "Transfer power through hips into release" }
                    ]
                },
                {
                    category: "Team Core",
                    defaultSetsReps: "1 x 30 sec",
                    items: [
                        { name: "Planks", setsReps: "1 x 30 sec", load: "Bodyweight", notes: "Neutral neck, glutes & quads clamped" },
                        { name: "Plank Ups", setsReps: "1 x 30 sec", load: "Bodyweight", notes: "Smooth forearm to hand transition" },
                        { name: "Hip Taps", setsReps: "1 x 30 sec", load: "Bodyweight", notes: "Anti-rotation from high plank" },
                        { name: "Shoulder Taps", setsReps: "1 x 30 sec", load: "Bodyweight", notes: "Minimal torso sway" },
                        { name: "Shifts", setsReps: "1 x 30 sec", load: "Bodyweight", notes: "Forward/backward toe glide" },
                        { name: "Rotations", setsReps: "1 x 30 sec", load: "Bodyweight", notes: "Controlled side stack" },
                        { name: "Side Planks", setsReps: "1 x 30 sec each", load: "Bodyweight", notes: "Oblique & hip stabilizer locking" }
                    ]
                },
                {
                    category: "Team Stretch Cool Down",
                    defaultSetsReps: "1 set x 30 sec",
                    items: [
                        { name: "Cat & Camel", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Segmental spinal flexion/extension" },
                        { name: "Bird Dogs", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Contralateral reach & brace" },
                        { name: "Primoris Figure 4", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Deep piriformis & glute release" },
                        { name: "Pigeons", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Hip rotator decompression" },
                        { name: "Hip Capsule Stretch", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Posterior hip glide" },
                        { name: "Lying T-Spine Rotations", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Open up thorax and breathing" },
                        { name: "Partner Hamstring Stretch (PNF)", setsReps: "1 set x 30 sec", load: "Assisted", notes: "Contract-relax 5s hold, 10s stretch" },
                        { name: "Partner Arm Stretch", setsReps: "1 set x 30 sec", load: "Assisted", notes: "Anterior shoulder & chest release" },
                        { name: "Partner Couch Stretch", setsReps: "1 set x 30 sec", load: "Assisted", notes: "Quadriceps & psoas lengthening" },
                        { name: "Pitchers Shoulder & Scap Mobility", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Scapular upward rotation & cuff reset" }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: "Day 2",
            title: "Speed, Power (Plyometrics) & Auxiliary",
            focus: "Linear Acceleration, Ground Force Transfer, Unilateral Strength & Core Chains",
            modules: [
                {
                    category: "Mobility",
                    defaultSetsReps: "",
                    items: [
                        { name: "Pre-Game / Practice Dynamic Warm Up", setsReps: "1 sequence", load: "Dynamic", notes: "Full athletic kinetic readiness" },
                        { name: "Ankle Rotations", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Dorsiflexion and eversion/inversion prep" }
                    ]
                },
                {
                    category: "Warm-up",
                    defaultSetsReps: "1 set x 10 yds",
                    items: [
                        { name: "Lateral Shuffles with Arm Swing", setsReps: "1 set x 10 yds", load: "Dynamic", notes: "Low center of mass, fluid arms" },
                        { name: "High Knees - Butt Kickers", setsReps: "1 set x 10 yds", load: "Dynamic", notes: "Rapid heel recovery to glutes" },
                        { name: "Irish Jigs - Jog Outs", setsReps: "1 set x 10 yds", load: "Dynamic", notes: "Rhythmic hamstring & hip pop" },
                        { name: "Carioca Small (Hips) - Carioca Big Cross Over", setsReps: "1 set x 10 yds", load: "Dynamic", notes: "Disassociate hips from shoulders" },
                        { name: "A-Run - A-Skips", setsReps: "1 set x 10 yds", load: "Dynamic", notes: "Toe up, knee up, strike under hips" },
                        { name: "Power Skips High - Reach", setsReps: "1 set x 10 yds", load: "Explosive", notes: "Max vertical displacement & arm reach" },
                        { name: "Goose Runs - Sprint Out", setsReps: "1 set x 10 yds", load: "Dynamic to Sprint", notes: "Straight leg hamstring strike into acceleration" }
                    ]
                },
                {
                    category: "Speed (Mechanics)",
                    defaultSetsReps: "",
                    items: [
                        { name: "Seated Arm Swings", setsReps: "3 x 15 sec", load: "Bodyweight", notes: "90° elbow lock, cheek to cheek" },
                        { name: "Half Kneeling Arm Swings", setsReps: "3 x 15 sec each", load: "Bodyweight", notes: "Eliminate trunk sway, explosive arm drive" }
                    ]
                },
                {
                    category: "Power (Plyometrics)",
                    defaultSetsReps: "",
                    items: [
                        { name: "Snap Down and Hold", setsReps: "3 x 2", load: "Bodyweight", notes: "Emphasize UAP, push floor" },
                        { name: "Snap Down → Broad Jump (Stick Hold)", setsReps: "3 x 1", load: "Bodyweight", notes: "Land balanced, hold 2 seconds" },
                        { name: "Snap Down → Squat Jump → Bound Out", setsReps: "3 sets", load: "Bodyweight", notes: "Elastic transition into forward explosion" },
                        { name: "Frontal Bounds", setsReps: "3 x 10 yds", load: "Bodyweight", notes: "Maximize horizontal air time & distance" },
                        { name: "Triple Jump Bounds", setsReps: "3 sets", load: "Bodyweight", notes: "Continuous ground contact rhythm" },
                        { name: "Single Leg Bounds", setsReps: "3 x 10 yds", load: "Bodyweight", notes: "Unilateral force absorption & redirection" },
                        { name: "Single Leg Triple Jump Bounds", setsReps: "4 sets", load: "Bodyweight", notes: "Stick final landing on one foot" },
                        { name: "Lateral Leap w/Stick", setsReps: "4 x 1 each", load: "Bodyweight", notes: "Absorb lateral shear force instantly" },
                        { name: "Lateral Bounds", setsReps: "2 x 10 yds", load: "Bodyweight", notes: "Speed skater bounds across 10 yards" }
                    ]
                },
                {
                    category: "Speed",
                    defaultSetsReps: "",
                    items: [
                        { name: "Half Kneeling Take Offs", setsReps: "6 x 10 yds", load: "Sprint", notes: "Drive lead shin forward at 45° angle" },
                        { name: "Lateral Half Kneeling Take Offs", setsReps: "6 x 10 yds", load: "Sprint", notes: "Push off trailing foot, rotate hips cleanly" },
                        { name: "Fall Sprints", setsReps: "6 sets", load: "Sprint", notes: "Lean forward to tip point, explode out" },
                        { name: "Crossover UAP Acceleration", setsReps: "4 x 10 yds", load: "Sprint", notes: "5 yds pull-up, then sprint" },
                        { name: "20m Accelerations Build Up", setsReps: "6 sets", load: "Sprint", notes: "95% effort, 15 sec rest between reps" },
                        { name: "75 yd Build-Ups", setsReps: "3 sets", load: "Sprint / Stride", notes: "Accelerate 0-75% over 50 yds, float last 25 yds" },
                        { name: "Cool-Down Walk", setsReps: "3–5 min", load: "Active Recovery", notes: "Down-regulate heart rate and nervous system" }
                    ]
                },
                {
                    category: "Auxiliary Strength",
                    defaultSetsReps: "",
                    items: [
                        { name: "A1) Barbell Split Squat", setsReps: "3 x 6 each", load: "Barbell / Load Match", notes: "Vertical torso, knee tracking over middle toes" },
                        { name: "A2) Half Kneeling DB Press", setsReps: "3 x 6", load: "DBs", notes: "Glute squeezed on kneeling leg, press overhead" },
                        { name: "B1) Single Leg Curl / Press", setsReps: "3 sets", load: "Cable / Machine", notes: "Strict unilateral hamstring contraction" },
                        { name: "B2) Banded Bear Isolation", setsReps: "3 sets", load: "Mini Band", notes: "Knees hover 1 inch, isometric shoulder/core tension" },
                        { name: "D1) Med Ball / Plate Core Circuit", setsReps: "2 x 6", load: "MB / Plate", notes: "Bilateral Set 1, Split Squat Sets 2-3" },
                        { name: "• Med Ball Split Fake Slams", setsReps: "Part of D1", load: "Med Ball", notes: "Rapid deceleration at hip level" },
                        { name: "• Plate Bulgarian Around the World", setsReps: "Part of D1", load: "25-45 lbs plate", notes: "Orbit plate around head in lunge" },
                        { name: "• Band Rotations", setsReps: "Part of D1", load: "Band", notes: "Pallof rotation with crisp snap" },
                        { name: "• Plate Rotations", setsReps: "Part of D1", load: "Plate", notes: "Seated or standing torso rotation" },
                        { name: "• Around the Worlds", setsReps: "Part of D1", load: "Plate", notes: "Shoulder girdle circle stability" },
                        { name: "Band Hip Mobility", setsReps: "Continuous", load: "Heavy Band", notes: "Couch, Lying 90, Allah, Standing Quad" }
                    ]
                },
                {
                    category: "Flexibility",
                    defaultSetsReps: "1 set x 30 sec",
                    items: [
                        { name: "Cat & Camel", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Spinal mobility and breath flow" },
                        { name: "Bird Dogs", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Glute-core integration" },
                        { name: "Primoris Figure 4", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Target outer hip and piriformis" },
                        { name: "Pigeons", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Deep glute & hip capsule stretch" },
                        { name: "Hip Capsule Stretch", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Posterior joint glide" },
                        { name: "Lying T-Spine Rotations", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Upper back rib mobility" },
                        { name: "Scorpions", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Anterior hip and lumbar extension" },
                        { name: "Supine Leg Swings", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Hamstring and groin dynamic stretch" },
                        { name: "Partner Hamstring Stretch", setsReps: "1 set x 30 sec", load: "Assisted", notes: "Hip Flexor & Hamstring focus" },
                        { name: "Partner Couch Stretch", setsReps: "1 set x 30 sec", load: "Assisted", notes: "Target rectus femoris & deep hip flexors" }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: "Day 3",
            title: "Upper Body Push/Pull, Cleans & Posterior Chain",
            focus: "Olympic Clean Hang Progressions, Bench Press Wave Loading (65-75%), Heavy Barbell RDLs & Nordic Curls",
            modules: [
                {
                    category: "Mobility",
                    defaultSetsReps: "1 set x 30 sec",
                    items: [
                        { name: "90/90 Reach Overs", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Hip internal & external rotation" },
                        { name: "Prone T-Spine Rotation", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Shoulder blade mobilization" },
                        { name: "3 Point T-Spine Rotation", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Full thoracic arch and twist" },
                        { name: "WGS Progression - Hip Flexor / T-Spine / Hamstring", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Multi-planar kinetic prep" },
                        { name: "Hip Rotations", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Hip socket decompression" },
                        { name: "Kickbacks", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Gluteus firing prep" },
                        { name: "Sumo Overhead Reach", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Adductors and lateral ribs" }
                    ]
                },
                {
                    category: "Power (Olympic Progression) - Cleans",
                    defaultSetsReps: "",
                    items: [
                        { name: "1st Pull Slow", setsReps: "2 x 3", load: "Barbell", notes: "Show hip hinge in hang position; smooth vertical bar path" },
                        { name: "Hip Hinge / Power Shrug", setsReps: "2 x 4", load: "Barbell", notes: "Violent hip extension into explosive trap elevation" },
                        { name: "Hip Hinge / High Pull", setsReps: "2 x 4", load: "Barbell", notes: "Keep bar close, elbows high and outside" }
                    ]
                },
                {
                    category: "Push Upper",
                    defaultSetsReps: "",
                    items: [
                        { name: "Bench Press", setsReps: "4 x 6", load: "65 / 70 / 75 / 75 %", notes: "Primary pressing strength: auto-calculated from 1RM", is1RMCalc: true, calcType: "bench", wave: [0.65, 0.70, 0.75, 0.75] },
                        { name: "Nordic Hamstring Curls", setsReps: "3 x 6", load: "Bodyweight / Eccentric", notes: "Slow 4-second eccentric descent; brace glutes" },
                        { name: "Prone / Supine T Rotations", setsReps: "4 x 8", load: "Light plates", notes: "2 sets each variation for scapular stabilizer strength" }
                    ]
                },
                {
                    category: "Pull Lower",
                    defaultSetsReps: "",
                    items: [
                        { name: "Barbell RDL", setsReps: "4 x 6", load: "Barbell (70-75% DL)", notes: "Hips push back, soft knees, neutral spine", is1RMCalc: true, calcType: "deadlift", wave: [0.65, 0.70, 0.75, 0.75] },
                        { name: "Single Arm Incline Press", setsReps: "3 x 6", load: "DB", notes: "Anti-rotational core demand on 30° incline" },
                        { name: "Single Leg Reverse Lunges", setsReps: "3 x 6 each", load: "DBs", notes: "Step back softly, drive through front heel" }
                    ]
                },
                {
                    category: "Core",
                    defaultSetsReps: "",
                    items: [
                        { name: "Ab Circuit", setsReps: "5 min", load: "Bodyweight", notes: "Continuous rotational & hollow hold rotations" },
                        { name: "Band Hamstring Series", setsReps: "5 min", load: "Bands", notes: "High volume blood flow & tendon conditioning" }
                    ]
                },
                {
                    category: "Team Stretch Cool Down",
                    defaultSetsReps: "1 set x 30 sec",
                    items: [
                        { name: "Cat & Camel", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Reset spinal column" },
                        { name: "Bird Dogs", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Restore balance" },
                        { name: "Primoris Figure 4", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Relieve sciatic and glute compression" },
                        { name: "Pigeons", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Hip rotators and external rotators" },
                        { name: "Hip Capsule Stretch", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Joint centration" },
                        { name: "Lying T-Spine Rotations", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Thoracic cage restoration" },
                        { name: "Scorpions", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Decompress anterior hip flexors" },
                        { name: "Supine Leg Swings", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Dynamic posterior release" },
                        { name: "Partner Hamstring Stretch", setsReps: "1 set x 30 sec", load: "Assisted", notes: "Hip Flexor & Hamstring focus" },
                        { name: "Partner Couch Stretch", setsReps: "1 set x 30 sec", load: "Assisted", notes: "Deep quadriceps elongation" }
                    ]
                }
            ]
        },
        {
            id: 4,
            name: "Day 4",
            title: "Speed Skill, Plyo Box & Hypertrophy",
            focus: "Glute Activation, Lateral Skater Sprints, Plyometric Box Complexes & Total Body Hypertrophy",
            modules: [
                {
                    category: "Mobility",
                    defaultSetsReps: "",
                    items: [
                        { name: "Pre-Game / Practice Dynamic Warm Up", setsReps: "1 sequence", load: "Dynamic", notes: "Total body kinetic primer" },
                        { name: "Ankle Rotations", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Ankle multi-angle prep" },
                        { name: "Hip Flexor Rotations", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Psoas and iliacus mobilization" }
                    ]
                },
                {
                    category: "Warm-Up",
                    defaultSetsReps: "1 set x 10 yds",
                    items: [
                        { name: "Lateral Shuffles with Arm Swing", setsReps: "1 set x 10 yds", load: "Dynamic", notes: "Stay level, quick feet" },
                        { name: "High Knees - Butt Kickers", setsReps: "1 set x 10 yds", load: "Dynamic", notes: "Fast ground contact time" },
                        { name: "Irish Jigs - Jog Outs", setsReps: "1 set x 10 yds", load: "Dynamic", notes: "Springy Achilles tendon pop" },
                        { name: "Carioca Small (Hips) - Carioca Big Cross Over", setsReps: "1 set x 10 yds", load: "Dynamic", notes: "Rotate pelvis around fixed shoulders" },
                        { name: "A-Run - A-Skips", setsReps: "1 set x 10 yds", load: "Dynamic", notes: "Forceful downward pawing action" },
                        { name: "Power Skips High - Reach", setsReps: "1 set x 10 yds", load: "Explosive", notes: "Drive opposite knee and arm to sky" },
                        { name: "Goose Runs - Sprint Out", setsReps: "1 set x 10 yds", load: "Dynamic to Sprint", notes: "Fast transition from straight leg to max turnover" }
                    ]
                },
                {
                    category: "Speed Skill",
                    defaultSetsReps: "",
                    items: [
                        { name: "Single Leg Glute Bridges", setsReps: "1 x 10 each", load: "Bodyweight", notes: "Lock out hip at top with no arching" },
                        { name: "Glute Bridge Switches", setsReps: "1 x 20", load: "Bodyweight", notes: "Rhythmic alternating leg switches in air" },
                        { name: "Glute Bridge Walkouts", setsReps: "1 x 5", load: "Bodyweight", notes: "Walk heels away to end-range knee extension" },
                        { name: "Hamstring Deceleration", setsReps: "1 x 20 sec", load: "Isometric", notes: "Resist sudden eccentric knee extension" },
                        { name: "1-2-3 Touch Switches", setsReps: "1 x 6", load: "Agility", notes: "Rapid change of direction foot taps" },
                        { name: "Half Kneeling Lateral Skater Take Off", setsReps: "5 x 10 yds", load: "Sprint", notes: "Lateral single-leg push into immediate linear burst" },
                        { name: "Power Shuffles", setsReps: "5 sets", load: "Explosive", notes: "Aggressive push off inside edge of back foot" },
                        { name: "3 Power Shuffles → Take Off Sprints", setsReps: "5 x 20 yds", load: "Sprint", notes: "3 low shuffles then plant and sprint 20 yds" }
                    ]
                },
                {
                    category: "Neuro Activation",
                    defaultSetsReps: "2 x 15 sec",
                    items: [
                        { name: "Short Pogos → High Pogos", setsReps: "2 x 20 yds", load: "Plyometric", notes: "Quick, high on whistle; stiff ankle bounce" },
                        { name: "Rapid Fire Hips", setsReps: "2 x 15 sec", load: "Glove Side / Hand Side", notes: "Snap hips back and forth on command" }
                    ]
                },
                {
                    category: "Plyo Box",
                    defaultSetsReps: "",
                    items: [
                        { name: "UAP Box Jumps", setsReps: "6 sets", load: "Box (24-36 in)", notes: "Start in athletic stance, jump and stick softly" },
                        { name: "Box Jumps", setsReps: "6 sets", load: "Box (30-42 in)", notes: "Max height generation with soft foot catch" },
                        { name: "Lateral Bound + Box Jump", setsReps: "4 sets", load: "Box", notes: "Bound sideways, plant and instantly jump onto box" },
                        { name: "Depth Jump + Squat Jump + Bound", setsReps: "1 x 4", load: "Box to Floor", notes: "Drop off 18-in box, rebound into squat jump, bound out" }
                    ]
                },
                {
                    category: "Full Body Hypertrophy",
                    defaultSetsReps: "",
                    items: [
                        { name: "A1) Lateral Lunges", setsReps: "3 x 12 each", load: "DB / KB", notes: "Sit into hip, trailing leg locked straight" },
                        { name: "A2) Band Hip Flexor Series", setsReps: "3 sets", load: "Mini Band", notes: "Standing high knee march against resistance" },
                        { name: "B1) Explosion Push Ups", setsReps: "3 x 12", load: "Bodyweight / Hands elevate", notes: "Push hard enough for hands to leave turf" },
                        { name: "B2) Incline IYT’s", setsReps: "3 x 8", load: "5-10 lbs DBs", notes: "Prone on incline bench: I-raise, Y-raise, T-raise" },
                        { name: "B3) Banded Shoulder Series", setsReps: "3 sets", load: "Bands", notes: "Pull-aparts, face pulls, and external rotations" },
                        { name: "C1) Pull Ups", setsReps: "3 x 10-12", load: "Bodyweight / Weighted", notes: "Dead hang to chest over bar" },
                        { name: "C2) Med Balance Series", setsReps: "3 x 12", load: "BOSU / Pad", notes: "Single leg proprioceptive balance and catch" },
                        { name: "C3) Band Hamstring Series", setsReps: "3 x 20-30", load: "Bands", notes: "Fast rhythmic prone band curls to pump blood" }
                    ]
                },
                {
                    category: "Flexibility",
                    defaultSetsReps: "1 set x 30 sec",
                    items: [
                        { name: "Cat/Cow", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Segmental spine rhythm" },
                        { name: "Bird Dogs", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Diagonal trunk reset" },
                        { name: "Lying T-Spine Rotation", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Open up chest and thoracic mobility" },
                        { name: "Sumo Reach Stretch", setsReps: "1 set x 30 sec", load: "Bodyweight", notes: "Sink deep into hips, reach across side body" }
                    ]
                }
            ]
        }
];

const RYAN_BROWN_HEAVY_DUTY_DAYS = [
    {
        id: 1,
        name: "Day 1",
        title: "Upper Torso: Chest, Lats & KSP Compound Pull",
        focus: "Ryan Brown Hypertrophy Protocol • 2 Working Sets to Failure • 4-2-4 Cadence • KSP Strength Staples • Olympic Optional",
        description: "Developed by Ryan Brown, Owner & Founder of KROME Sports Performance. Combines high-intensity bodybuilding principles with KSP strength pillars. Pre-exhausts the pectorals and lats with strict isolation before immediately driving into heavy compound presses and rows. Eliminates the arms as the weak link.",
        recoveryRecommendation: "Allow 72–96 hours of rest before repeating upper body training.",
        modules: [
            {
                category: "Joint Acclimation & Scapular Prep (Non-Fatiguing)",
                defaultSetsReps: "1 set x 10 (Controlled)",
                items: [
                    { name: "Scapular Wall Slides", setsReps: "1 set x 10", load: "Bodyweight", notes: "Slow 3-second glide; depress scaps without creating fatigue" },
                    { name: "Band Dislocates / Pass-Throughs", setsReps: "1 set x 10", load: "Light Band", notes: "Rotator cuff and glenohumeral lubrication" },
                    { name: "Prone Swimmers", setsReps: "1 set x 8", load: "Bodyweight", notes: "Neuromuscular shoulder capsule activation" }
                ]
            },
            {
                category: "Chest Pre-Exhaustion Superset (0 sec rest between A1 & A2)",
                defaultSetsReps: "2 all-out working sets to failure (90s rest between sets)",
                items: [
                    { 
                        name: "A1) Pec Deck Flyes (or Incline Dumbbell Flyes)", 
                        setsReps: "2 sets x 8-10 to failure", 
                        load: "Moderate / Heavy", 
                        notes: "ISOLATION: Strict 4-sec negative, 2-sec peak squeeze at center. Push to absolute momentary concentric failure, then immediately move to Incline Barbell Press with 0 seconds rest!" 
                    },
                    { 
                        name: "A2) Incline Barbell Bench Press (KSP Strength Staple)", 
                        setsReps: "2 sets x 6-8 to failure", 
                        load: "75% 1RM Working Weight", 
                        notes: "COMPOUND: Follow flyes immediately! Lower bar under strict control (4-sec eccentric). Press with pure chest drive until positive failure. Rest 90-120s, then repeat the superset for Set 2.",
                        is1RMCalc: true,
                        calcType: "bench",
                        wave: [0.75]
                    },
                    { 
                        name: "B) Chest Dips (Parallel Bars) or Flat DB Bench", 
                        setsReps: "2 sets x 6-10 to failure", 
                        load: "Bodyweight or Weighted Belt", 
                        notes: "Torso leaned 30° forward, elbows flared slightly outward. 4-sec deep stretch descent, smooth press. Push both sets until no full positive rep remains." 
                    }
                ]
            },
            {
                category: "Back & Lat Pre-Exhaustion Superset (0 sec rest between C1 & C2)",
                defaultSetsReps: "2 all-out working sets to failure (90s rest between sets)",
                items: [
                    { 
                        name: "C1) Dumbbell Pullovers (or Straight-Arm Cable Pulldown)", 
                        setsReps: "2 sets x 8-10 to failure", 
                        load: "Heavy Dumbbell", 
                        notes: "ISOLATION: Lie across bench. Deep lat stretch overhead (4-sec descent), pull with lats to ribcage. Take to failure, then move directly to close-grip pulldowns!" 
                    },
                    { 
                        name: "C2) Close-Grip Underhand Chins (or Lat Pulldown)", 
                        setsReps: "2 sets x 6-8 to failure", 
                        load: "Heavy Working Load", 
                        notes: "COMPOUND: Palms facing you (supinated grip puts biceps in mechanical advantage to thoroughly exhaust the pre-fatigued lats). 2-sec hold at collarbone." 
                    },
                    { 
                        name: "D) Bent-Over Barbell Rows (KSP Strength Pillar)", 
                        setsReps: "2 sets x 6-8 to failure", 
                        load: "Barbell (Heavy)", 
                        notes: "KSP STAPLE: Torso locked at 70° angle. Zero lower back rocking or hip swing. Pull smoothly to upper abdomen, pause for 2 seconds, lower in 4 seconds.",
                        is1RMCalc: true,
                        calcType: "row",
                        wave: [0.75]
                    }
                ]
            },
            {
                category: "Posterior Chain Overload & Optional Olympic Pull",
                defaultSetsReps: "2 all-out working sets",
                items: [
                    { 
                        name: "E) Heavy Conventional Barbell Deadlift (KSP Pillar)", 
                        setsReps: "2 sets x 5-7 to failure", 
                        load: "78% 1RM", 
                        notes: "The foundational full-body mass builder. Pull from a dead stop every rep (no touch-and-go bounce). Lock out tall, lower in 3-4 controlled seconds.",
                        is1RMCalc: true,
                        calcType: "deadlift",
                        wave: [0.78]
                    },
                    { 
                        name: "F) [OPTIONAL OLYMPIC LIFT] Olympic Power Clean or Clean High Pull", 
                        setsReps: "3 sets x 2 reps (Optional)", 
                        load: "60-70% 1RM (Technique Focus)", 
                        notes: "OPTIONAL ATHLETE MODULE: If you desire explosive kinetic integration, perform 3 crisp doubles. If focusing strictly on traditional bodybuilding, replace this with Barbell Shrugs (2 sets x 10 reps, 3-sec peak squeeze)." 
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Day 2",
        title: "Lower Body: Quadriceps Pre-Exhaustion, KSP Nordics & Posterior Chain",
        focus: "Ryan Brown Hypertrophy Protocol • 2 Working Sets to Failure • KSP Nordic Curls • Contralateral Step-Ups • Zero Speed/Plyo",
        description: "Intense lower body session applying Ryan Brown's quad pre-exhaustion methodology combined with signature KSP posterior chain staples. Pre-exhausts the quadriceps before compound squatting to minimize spinal fatigue as a limiter, followed by intense Nordic curls and RDLs.",
        recoveryRecommendation: "Allow 72–96 hours of recovery before high-intensity leg stimulation.",
        modules: [
            {
                category: "Joint Prep & Knee Acclimation (Non-Fatiguing)",
                defaultSetsReps: "1 set x 8-10 (Slow)",
                items: [
                    { name: "Slow Bodyweight Air Squats", setsReps: "1 set x 10", load: "Bodyweight", notes: "Controlled 3-sec descent; open hips and knees" },
                    { name: "Half-Kneeling Hip Flexor Stretch", setsReps: "1 set x 30 sec/side", load: "Bodyweight", notes: "Decompress psoas and anterior hip capsule" },
                    { name: "Ankle Dorsiflexion Wall Rocks", setsReps: "1 set x 12/side", load: "Bodyweight", notes: "Achilles tendon mobility; drive knee over toes" }
                ]
            },
            {
                category: "Quadriceps Pre-Exhaustion Superset (0 sec rest between A1 & A2)",
                defaultSetsReps: "2 all-out working sets to failure (90s rest between sets)",
                items: [
                    { 
                        name: "A1) Machine Leg Extensions", 
                        setsReps: "2 sets x 10-12 to failure", 
                        load: "Moderate / Heavy", 
                        notes: "ISOLATION: 4-sec negative, 2-sec peak lockout squeeze. Take to absolute failure, then step directly to Back Squats with 0 sec rest!" 
                    },
                    { 
                        name: "A2) Barbell Back Squat (KSP Heavy Strength)", 
                        setsReps: "2 sets x 6-8 to failure", 
                        load: "72-75% 1RM Working Weight", 
                        notes: "COMPOUND: Immediately follow leg extensions! With quads pre-exhausted, the glutes and adductors assist in pushing quads past normal thresholds. Rest 90-120s between sets.",
                        is1RMCalc: true,
                        calcType: "squat",
                        wave: [0.72]
                    }
                ]
            },
            {
                category: "KSP Unilateral & Posterior Chain Overload",
                defaultSetsReps: "2 all-out working sets to failure",
                items: [
                    { 
                        name: "B) Contralateral Dumbbell Step-Ups (KSP Signature Staple)", 
                        setsReps: "2 sets x 8 reps/leg to failure", 
                        load: "Moderate / Heavy DBs", 
                        notes: "KSP STRENGTH STAPLE: Hold single dumbbell in opposite hand of working leg. Drive through lead heel, slow 3-second descent. Zero push-off from bottom foot." 
                    },
                    { 
                        name: "C1) Nordic Hamstring Curls (KSP Knee Flexion Staple)", 
                        setsReps: "2 sets x 6-8 to failure", 
                        load: "Bodyweight / Band Assisted", 
                        notes: "KSP ELITE STRENGTH: Strict eccentric knee flexion. Control descent for 4 full seconds before soft catch and press back up. Squeeze glutes throughout." 
                    },
                    { 
                        name: "C2) Barbell Romanian Deadlifts (KSP Hip Hinge Staple)", 
                        setsReps: "2 sets x 6-8 to failure", 
                        load: "70% Deadlift Max", 
                        notes: "Push hips straight back, soft knees. 4-sec descent until extreme hamstring stretch is reached, then drive hips forward to neutral.",
                        is1RMCalc: true,
                        calcType: "deadlift",
                        wave: [0.70]
                    }
                ]
            },
            {
                category: "Calves & Abdominals",
                defaultSetsReps: "2 all-out working sets",
                items: [
                    { 
                        name: "D) Standing Machine Calf Raises", 
                        setsReps: "2 sets x 12-15 to failure", 
                        load: "Heavy Working Weight", 
                        notes: "Ryan Brown Calf Protocol: 4-sec negative, 2-sec dead-stop stretch at bottom, explosive rise, 2-sec peak contraction on toes. Zero bouncing!" 
                    },
                    { 
                        name: "E) Hanging Leg Raises (or Machine Ab Crunch)", 
                        setsReps: "2 sets x 12-15 to failure", 
                        load: "Bodyweight / Machine Stack", 
                        notes: "Curl pelvis upward rather than flexing hip flexors. 3-sec negative descent. Zero swinging momentum." 
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        name: "Day 3",
        title: "Deltoids, Upper Arms & KSP Auxiliary Press",
        focus: "Ryan Brown Hypertrophy Protocol • 2 Working Sets to Failure • Triceps Pushdown-to-Dip Superset • Strict Bicep Peak",
        description: "Targets the complete shoulder girdle and upper extremities using Ryan Brown's KSP hypertrophy split. Employs the famous cable pushdown to dip triceps pre-exhaustion superset alongside strict, momentum-free lateral raises, KSP face pulls, and straight-bar curls.",
        recoveryRecommendation: "Allow 48–72 hours of recovery before next session.",
        modules: [
            {
                category: "Shoulder Capsule Acclimation (Non-Fatiguing)",
                defaultSetsReps: "1 set x 10 (Smooth)",
                items: [
                    { name: "Prone Y-T-W Shoulder Retractions", setsReps: "1 set x 8 each", load: "Bodyweight", notes: "Scapular stabilizer priming" },
                    { name: "Band External Rotations", setsReps: "1 set x 12/side", load: "Light Band", notes: "Infraspinatus and teres minor warm-up" }
                ]
            },
            {
                category: "Deltoid Tri-Angle Overload",
                defaultSetsReps: "2 all-out working sets to failure (90s rest)",
                items: [
                    { 
                        name: "A) Standing Dumbbell Lateral Raises", 
                        setsReps: "2 sets x 8-12 to failure", 
                        load: "Moderate DBs", 
                        notes: "STRICT ISOLATION: Raise arms directly to 90° parallel. Pause for 2 seconds at top. 4-sec lowering. Zero hip swing or shrugging with traps." 
                    },
                    { 
                        name: "B) KSP Cable Face Pulls (or Rear Delt Flyes)", 
                        setsReps: "2 sets x 10-12 to failure", 
                        load: "Rope Attachment", 
                        notes: "KSP POSTURE STAPLE: Pull rope toward nose while rotating knuckles backward. Squeeze posterior delts and rhomboids for 2 full seconds." 
                    },
                    { 
                        name: "C) Seated Overhead Barbell (or Dumbbell) Press", 
                        setsReps: "2 sets x 6-8 to failure", 
                        load: "Heavy Working Weight", 
                        notes: "COMPOUND: Lower weight slowly to chin level (4-sec descent). Press upward without locking out completely to maintain continuous tension." 
                    }
                ]
            },
            {
                category: "Triceps Pre-Exhaustion Superset (0 sec rest between D1 & D2)",
                defaultSetsReps: "2 all-out working sets to failure (90s rest between sets)",
                items: [
                    { 
                        name: "D1) Cable Triceps Pushdowns", 
                        setsReps: "2 sets x 8-10 to failure", 
                        load: "Cable Stack", 
                        notes: "ISOLATION: Elbows pinned to ribs. Lock out triceps fully and flare wrists out for 2-sec static contraction. Push to failure, then immediately proceed to dips!" 
                    },
                    { 
                        name: "D2) Parallel Bar Dips (or Close-Grip Bench Press)", 
                        setsReps: "2 sets x 6-8 to failure", 
                        load: "Bodyweight / Weighted", 
                        notes: "COMPOUND: Follow pushdowns immediately! Keep torso upright to force the pre-exhausted triceps to bear the brunt of the pressing load. Go to positive failure." 
                    }
                ]
            },
            {
                category: "Biceps Peak Hypertrophy",
                defaultSetsReps: "2 all-out working sets to failure",
                items: [
                    { 
                        name: "E) Strict Standing Barbell Biceps Curls", 
                        setsReps: "2 sets x 6-8 to failure", 
                        load: "Straight Bar", 
                        notes: "Stand with back against a post to eliminate all body sway. 2-sec positive, 2-sec static contraction at chin height, 4-sec negative." 
                    },
                    { 
                        name: "F) Incline Dumbbell Alternating Curls", 
                        setsReps: "2 sets x 8-10 to failure", 
                        load: "Dumbbells", 
                        notes: "45° incline bench provides massive stretch on the long head of the bicep. Control the eccentric descent for a full 4 seconds." 
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        name: "Day 4",
        title: "Consolidated Big-4 Heavy Overload & Kinetic Strength",
        focus: "Ryan Brown Hypertrophy Protocol • 2 Working Sets to Failure • The Ryan Brown Big 4 • Olympic Lifts Optional",
        description: "The crown jewel of Ryan Brown's KSP Hypertrophy curriculum. Designed for athletes and lifters who want maximal muscular mass, joint longevity, and dense systemic strength. Focuses on the highest-yielding multi-joint movements in human physiology.",
        recoveryRecommendation: "Allow 96 hours of rest before next intense training stimulus.",
        modules: [
            {
                category: "Specific Acclimation (Non-Fatiguing)",
                defaultSetsReps: "2 sets x 5 (Submaximal)",
                items: [
                    { name: "Empty Barbell Squat Acclimation", setsReps: "2 sets x 5", load: "Barbell (45 lbs)", notes: "Establish groove and deep hip flexion" },
                    { name: "Cat/Cow & Bird Dogs", setsReps: "1 set x 8", load: "Bodyweight", notes: "Spinal decompress and pelvic neutral check" }
                ]
            },
            {
                category: "The Ryan Brown Big-4 (2 Sets to Failure)",
                defaultSetsReps: "2 all-out working sets to failure (120s rest between sets)",
                items: [
                    { 
                        name: "A) Barbell Back Squat (KSP Heavy Wave)", 
                        setsReps: "2 sets x 6-8 to failure", 
                        load: "75% 1RM Working Weight", 
                        notes: "1-2 light feeder sets to warm up, then TWO all-out working sets to absolute concentric failure. Push with everything you have.",
                        is1RMCalc: true,
                        calcType: "squat",
                        wave: [0.75]
                    },
                    { 
                        name: "B) Flat Barbell Bench Press", 
                        setsReps: "2 sets x 6-8 to failure", 
                        load: "75% 1RM Working Weight", 
                        notes: "Controlled 4-second descent to mid-sternum. Smooth press without bouncing off chest. Squeeze pecs into absolute failure.",
                        is1RMCalc: true,
                        calcType: "bench",
                        wave: [0.75]
                    },
                    { 
                        name: "C) Close-Grip Underhand Chins (or Lat Pulldowns)", 
                        setsReps: "2 sets x 6-8 to failure", 
                        load: "Bodyweight / Weighted", 
                        notes: "Dead hang stretch to chin over bar. Squeeze lats and biceps simultaneously for 2-sec at peak contraction." 
                    },
                    { 
                        name: "D) Heavy Barbell Deadlift (KSP Posterior Staple)", 
                        setsReps: "2 sets x 5-6 to failure", 
                        load: "80% 1RM Working Weight", 
                        notes: "Reset every rep at the floor. Strict spine neutral. Drive the floor away with leg press mechanics.",
                        is1RMCalc: true,
                        calcType: "deadlift",
                        wave: [0.80]
                    }
                ]
            },
            {
                category: "Trapezius & Neck Armor",
                defaultSetsReps: "2 all-out working sets",
                items: [
                    { 
                        name: "E) Heavy Barbell Power Shrugs", 
                        setsReps: "2 sets x 8-10 to failure", 
                        load: "Heavy Barbell / Dumbbells", 
                        notes: "Elevate shoulders straight up to ears. Hold peak contraction for 3 full seconds. Never roll the shoulders (protects rotator cuff)." 
                    }
                ]
            },
            {
                category: "Optional Olympic Power Finisher (Athlete Cross-Over)",
                defaultSetsReps: "3 sets x 2 reps (Optional)",
                items: [
                    { 
                        name: "F1) [OPTIONAL OLYMPIC LIFT] Hang Power Clean", 
                        setsReps: "3 sets x 2 reps (Optional)", 
                        load: "65% 1RM (Technique Focus)", 
                        notes: "OPTIONAL ATHLETE TRACK: For athletes who want to retain kinetic hip extension velocity. Keep reps low (2 reps) so it does not interfere with muscular recovery. Can be completely omitted if focusing strictly on bodybuilding." 
                    },
                    { 
                        name: "F2) [OPTIONAL OLYMPIC LIFT] Snatch-Grip High Pull", 
                        setsReps: "3 sets x 3 reps (Optional)", 
                        load: "Moderate / Light", 
                        notes: "OPTIONAL ATHLETE TRACK: Wide grip violent hip thrust and upper trap pull. Completely optional." 
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        name: "Recovery Week",
        title: "Active Regeneration, Joint Decompression & Tissue Reset",
        focus: "Ryan Brown Recovery Protocol • Cycle Every 4–6 Weeks • Submaximal Blood Flush • Zero Failure • Myofascial Flossing",
        description: "The essential deload and supercompensation week of the Ryan Brown Hypertrophy System. High-intensity training pushed to failure accumulates peripheral joint stress and central nervous system (CNS) fatigue. Executing this structured recovery week every 4 to 6 weeks restores neuromuscular output, clears micro-inflammation, and primes muscle fibers for explosive new hypertrophic growth.",
        recoveryRecommendation: "Complete this full 7-day regenerative cycle before resuming high-intensity overload.",
        modules: [
            {
                category: "CNS & Muscular Blood-Flow Flush (Zero Failure • Submaximal)",
                defaultSetsReps: "2 sets x 12 reps (RPE 5-6 • 50% 1RM)",
                items: [
                    { 
                        name: "Submaximal Goblet Squat (Tempo 3-1-3)", 
                        setsReps: "2 sets x 12 reps", 
                        load: "Light Dumbbell (25-35 lbs)", 
                        notes: "RECOVERY: 3s down, 1s pause in deep hole, 3s up. Zero failure. Flush synovial fluid and oxygenated blood into hips and knees." 
                    },
                    { 
                        name: "Light Incline Dumbbell Press (Blood Pump)", 
                        setsReps: "2 sets x 12 reps", 
                        load: "50% Normal Working Weight", 
                        notes: "RECOVERY: Smooth rhythmic pressing. Keep 4-5 reps in reserve. Focus on active muscular pump without connective tissue stress." 
                    },
                    { 
                        name: "Chest-Supported Dumbbell Rows", 
                        setsReps: "2 sets x 12 reps", 
                        load: "Light / Moderate DBs", 
                        notes: "RECOVERY: Bench supports torso to completely offload lower back. Light 2-second squeeze between shoulder blades." 
                    },
                    { 
                        name: "Decompression Passive Dead Hangs", 
                        setsReps: "3 sets x 30-45 sec hang", 
                        load: "Bodyweight", 
                        notes: "Hang relaxed from pull-up bar. Deep belly breaths to traction spinal vertebrae and relieve compression from heavy squats and deadlifts." 
                    }
                ]
            },
            {
                category: "KSP Fascial & Soft-Tissue Restoration",
                defaultSetsReps: "2 sets x 60 sec each area",
                items: [
                    { 
                        name: "Foam Roll Thoracic Spine & Lat Flossing", 
                        setsReps: "2 sets x 60 sec", 
                        load: "High-Density Foam Roller", 
                        notes: "Mobilize upper back extension and release tight lat attachments to restore overhead pressing range of motion." 
                    },
                    { 
                        name: "Lacrosse Ball Pectoral & Posterior Capsule Release", 
                        setsReps: "2 sets x 45 sec/side", 
                        load: "Lacrosse Ball", 
                        notes: "Pin ball against wall in anterior shoulder/pec minor. Slowly rotate arm through full range of motion to break down trigger points." 
                    },
                    { 
                        name: "90/90 Dynamic Hip Switches & Psoas Stretch", 
                        setsReps: "2 sets x 10 switches", 
                        load: "Bodyweight", 
                        notes: "Internal and external hip rotation. Unlocks tight pelvic tilt created by heavy deadlifts and squats." 
                    },
                    { 
                        name: "Banded Hamstring Distraction Stretch", 
                        setsReps: "2 sets x 45 sec/leg", 
                        load: "Heavy Loop Band", 
                        notes: "Decompress sciatic nerve pathway and restore resting length to biceps femoris without ballistic jerking." 
                    }
                ]
            },
            {
                category: "Parasympathetic Reset & Aerobic Flushing",
                defaultSetsReps: "Daily Recovery Protocols",
                items: [
                    { 
                        name: "Low-Intensity Steady State (LISS) Zone 1 Aerobic Flush", 
                        setsReps: "20-25 minutes", 
                        load: "HR 110-125 BPM", 
                        notes: "Incline outdoor walk, light assault bike, or backward sled drags. Clears metabolic waste and enhances systemic blood circulation." 
                    },
                    { 
                        name: "Diaphragmatic Box Breathing Protocol", 
                        setsReps: "8-10 minutes post-session", 
                        load: "Supine (Lying Down)", 
                        notes: "4s inhale through nose, 4s hold, 4s exhale through mouth, 4s hold. Shifts the nervous system from sympathetic fight-or-flight to parasympathetic healing." 
                    },
                    { 
                        name: "Sleep & Hydration Supercompensation", 
                        setsReps: "8.5+ Hours Sleep / 1 Gallon Water", 
                        load: "Quality Rest", 
                        notes: "Myofibrillar protein synthesis and hormone replenishment occur during deep slow-wave sleep. Ensure 1g protein per lb bodyweight and adequate electrolytes." 
                    }
                ]
            },
            {
                category: "Readiness Testing Checklist for Return to High-Intensity Overload",
                defaultSetsReps: "Self-Assessment Protocol",
                items: [
                    { 
                        name: "Grip Isometric Squeeze Readiness Check", 
                        setsReps: "Pass / Fail Check", 
                        load: "Dynamometer or Hand Squeeze", 
                        notes: "If your morning grip strength feels sluggish or below baseline, extend the recovery week by an extra 48 hours before loading heavy." 
                    },
                    { 
                        name: "Joint Tendon Pain-Free Assessment", 
                        setsReps: "Pass / Fail Check", 
                        load: "Bodyweight Assessment", 
                        notes: "Knees, elbows, and lumbar spine must feel 100% pain-free and mobile before resuming the 2-working-sets-to-failure cycle." 
                    }
                ]
            }
        ]
    }
];

const RYAN_BROWN_PRINCIPLES = [
    {
        title: "2 Working Sets to Absolute Muscular Failure",
        summary: "Developed by Ryan Brown, Owner & Founder of KROME Sports Performance. Perform 1-2 light feeder sets to grease the joint groove, followed by exactly TWO all-out working sets taken to momentary concentric muscular failure. Rest 90–120 seconds between working sets. This provides optimal mechanical tension without inducing excessive neural fatigue."
    },
    {
        title: "Strict 4-2-4 Cadence (Zero Momentum)",
        summary: "4 seconds controlled eccentric lowering, 2 seconds static hold at peak contraction, and 2 seconds smooth concentric drive. Eliminates all ballistic jerking and elastic recoil, delivering pure mechanical tension directly to the working muscle fibers."
    },
    {
        title: "Pre-Exhaustion Compound Supersets",
        summary: "Fatigue the target prime mover first with a single-joint isolation exercise (e.g., Pec Deck flyes or Leg Extensions), then immediately follow with a compound movement (Incline Barbell Bench or Back Squats) with 0 seconds rest. Secondary synergists can no longer limit target muscle overload."
    },
    {
        title: "KSP Strength Pillars Integrated",
        summary: "Seamlessly weaves KROME Sports Performance staple movements—including Nordic Hamstring Curls, Contralateral DB Step-Ups, Bent-Over Barbell Rows, and Romanian Deadlifts—into the hypertrophy architecture."
    },
    {
        title: "No Speed Drills & No Plyometrics",
        summary: "All ballistic sprint mechanics and reactive box plyometrics are eliminated in this bodybuilding track. 100% of your body's adaptive reserve is channeled into muscle fiber hypertrophy and structural recovery."
    },
    {
        title: "Olympic Lifts Are Strictly Optional",
        summary: "Traditional bodybuilding prioritizes localized motor unit fatigue over bar velocity. Olympic cleans and high pulls are included strictly as an optional technique module. You can substitute heavy barbell deadlifts and shrugs with zero compromise."
    },
    {
        title: "Mandatory Active Recovery Week Cycle",
        summary: "Every 4 to 6 weeks, step back into the structured Ryan Brown Recovery Week. Submaximal 50% blood-flow flushes, fascial release, and parasympathetic breathwork allow joints, tendons, and CNS reserves to supercompensate for next-level strength gains."
    }
];

const KROME_STRENGTH_BLUEPRINT = {
    title: "Strength & Power E-Book Blueprint",
    subtitle: "Complete Athletic & Traditional Strength Curriculum • Olympic Progressions, Kinetic Speed & Ryan Brown Hypertrophy Protocol",
    version: "2026.3",
    tracks: {
        athletic: {
            id: "athletic",
            name: "Athletic Force & Speed Track",
            badge: "Athletic Curriculum • Olympic & Speed",
            subtitle: "Explosive Olympic Clean Progressions, Wave-Loaded Compound Lifts, Speed Mechanics, Box Plyometrics & Rotational ESD",
            days: ATHLETIC_FORCE_DAYS
        },
        ryan_brown_heavy_duty: {
            id: "ryan_brown_heavy_duty",
            name: "Ryan Brown Hypertrophy Protocol",
            founder: "Ryan Brown, Owner & Founder of KROME Sports Performance",
            badge: "Traditional Bodybuilding • Ryan Brown Hypertrophy Protocol",
            subtitle: "Developed by Ryan Brown (Owner & Founder of KROME Sports Performance) • 2 Working Sets to Failure • 4-2-4 Cadence • KSP Strength Pillars • Recovery Week Included • Zero Speed/Plyo • Olympic Optional",
            days: RYAN_BROWN_HEAVY_DUTY_DAYS,
            principles: RYAN_BROWN_PRINCIPLES
        },
        // Alias for backwards compatibility
        mentzer_hit: {
            id: "ryan_brown_heavy_duty",
            name: "Ryan Brown Hypertrophy Protocol",
            founder: "Ryan Brown, Owner & Founder of KROME Sports Performance",
            badge: "Traditional Bodybuilding • Ryan Brown Hypertrophy Protocol",
            subtitle: "Developed by Ryan Brown (Owner & Founder of KROME Sports Performance) • 2 Working Sets to Failure • 4-2-4 Cadence • KSP Strength Pillars • Recovery Week Included",
            days: RYAN_BROWN_HEAVY_DUTY_DAYS,
            principles: RYAN_BROWN_PRINCIPLES
        }
    },
    // Backwards compatibility default
    days: ATHLETIC_FORCE_DAYS
};

if (typeof window !== 'undefined') {
    window.KROME_STRENGTH_BLUEPRINT = KROME_STRENGTH_BLUEPRINT;
    window.RYAN_BROWN_HEAVY_DUTY_DAYS = RYAN_BROWN_HEAVY_DUTY_DAYS;
    window.RYAN_BROWN_PRINCIPLES = RYAN_BROWN_PRINCIPLES;
}

