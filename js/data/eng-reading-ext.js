/* ==========================================================================
   ENG_READING_EXT — o'qish matnlarini imtihon uzunligiga (750+ so'z) yetkazish
   --------------------------------------------------------------------------
   Nega: platformadagi 72 matnning hammasi 400–660 so'z edi; haqiqiy IELTS
   Academic matni 700–900 so'z. Qisqa matnda "chidamlilik" — 60 daqiqada
   3 ta uzun matn — mashq qilinmaydi. Eng yuqori darajali 10 ta matn
   (READING_4 ning 8 tasi + READING_3 dan 2 tasi) 750+ so'zga uzaytirildi.

   Qanday: yangi abzats QO'SHILMAYDI (sarlavha moslashtirish A–F ga
   bog'langan). Mavjud abzatslarning oxiriga 1–3 gap qo'shiladi. Har gap
   savollar bilan solishtirib yozilgan: NOT GIVEN javoblari (masalan
   "burn patients need no medication", "dogs pass the mirror test", "bees
   produce more honey", "memory in younger people") mavzusiga tegilmaydi,
   TRUE/FALSE javoblari o'zgarmaydi.

   Format: EXT[<global nomi>][<matn n>][<abzats id>] = " qo'shimcha matn"
   Yuklanganda applyReadingExt() abzats matniga qo'shib qo'yadi (bir marta).
   ========================================================================== */
(function () {
  'use strict';

  var EXT = {
    ENG_READING_4: {
      17: { /* The Power of Virtual Reality — 659 → ~830 */
        A: " Sutherland's machine could show only a few hundred lines at once, and the computer that drove it filled a room; the gap between the idea and any usable product was not one of imagination but of hardware, and it took half a century of cheaper, faster components to close it.",
        B: " Researchers measure presence indirectly — by heart rate, by the sweat on the skin, by whether people duck when a virtual object flies at them — because asking someone whether they felt present is an unreliable guide to what their body actually did.",
        C: " Medical schools have found a further advantage: a rare complication that a trainee might otherwise never see can be reproduced on demand, so that the first encounter with it happens in a simulator rather than in an operating theatre.",
        E: " Cost has been a quieter obstacle. A headset good enough to avoid discomfort remains expensive, and the content that justifies the purchase is thin, so that many devices bought in a burst of enthusiasm are used for a few weeks and then put away."
      },
      18: { /* High-Flying Helpers — 619 → ~790 */
        A: " Each aircraft weighs about as much as a bicycle and carries a payload of under two kilograms, which is enough for several units of blood packed in an insulated box. Orders are tracked from the moment they are placed, and the clinic is warned by message a minute before the drop.",
        C: " The economics are simple: fertiliser and pesticide are among a farmer's largest costs, and applying them only where they are needed cuts both the bill and the run-off into rivers.",
        D: " After the Nepal earthquake of 2015, aerial images taken in the first days helped relief workers decide which cut-off villages to reach first.",
        F: " The economics follow the same rule as the technology: a delivery that costs a few dollars by drone is worth it when the alternative is a four-hour drive, and not worth it when it is a ten-minute walk. That arithmetic, rather than any limit of engineering, is what decides where the aircraft appear."
      },
      19: { /* What's on Your Mind? — 588 → ~770 */
        A: " The picture persists because it matches the experience of remembering, which feels like playback: the scene appears, complete and in order, and nothing in the experience reveals the assembly that produced it.",
        B: " Later versions of the experiment went further. By showing participants doctored photographs, or simply by having a relative describe an event that had never happened, researchers implanted entire memories — of being lost in a shopping centre as a child, for example — that participants then described in detail and with confidence.",
        D: " The intervals matter more than the total. Ten minutes of review the next day, ten more a week later and ten the month after that will hold more than an hour of re-reading the night before an exam, because each return interrupts the curve just as it begins to fall.",
        E: " The practical conclusion is uncomfortable for anyone who prefers to feel prepared: a study session that ends with confident, fluent recognition of the page has probably produced less learning than one that ends with a struggle to recall it."
      },
      20: { /* Inside Animal Minds — 614 → ~810 */
        A: " Pfungst's method was as important as his conclusion. He varied one condition at a time — the questioner's knowledge, the questioner's visibility, the distance between them — until the single factor on which the horse's success depended stood out.",
        B: " The crows' hooks are not accidents of play: a bird presented with a straight wire and a food tube will bend the wire, test it, and adjust the bend if the first attempt fails, which is the sequence a human engineer would follow.",
        C: " The test has been repeated with other chimpanzees and with human volunteers who trained for weeks; the humans improved, but never matched the chimpanzee's speed.",
        E: " An octopus that has learned to open a jar in one trial will open it faster the next day, and captive animals have been recorded dismantling tank equipment and escaping through gaps the width of an eye — behaviour that looks, from outside, very much like curiosity.",
        F: " That last clause is the important one. The instruments available to a scientist — mazes, mirrors, touchscreens — were designed by primates for primates, and an animal that fails them may simply be answering a question it was never asked."
      },
      21: { /* Van Gogh's World — 632 → ~810 */
        B: " He was, by his own account, a demanding teacher of himself: the letters record months spent on the anatomy of hands and the fall of light on a wall, exercises that an academy would have set and that he set for himself, redrawn until they satisfied him.",
        C: " The southern light did more than brighten his colours; it changed his speed. He worked outdoors in the wind, tying the canvas down, finishing a picture in a single sitting so that the light in it would be one light and not several.",
        E: " She kept a careful register of every sale and loan, refused offers that would have scattered the collection, and steered the largest part of it towards a single museum, so that the paintings could be seen together, in the order they were made.",
        F: " The wrongness matters, because the legend teaches the opposite of what his life shows. It suggests that great work comes from suffering. His letters say the reverse: the work came from method, from looking, and from ten years of practice that no illness could supply."
      },
      22: { /* Seeing the Light — 579 → ~800 */
        A: " The portable version was so common by the eighteenth century that a landscape painter travelling without one would have been unusual, and its influence can be seen in the precise perspective of the Venetian views of the period.",
        B: " Daguerre's improvement lay in chemistry rather than optics: he found that a plate exposed too briefly to show any picture at all would still reveal one if it was afterwards held over mercury vapour, so that an invisible trace could be developed into a visible image.",
        C: " The image was a mirror, so faint that it had to be tilted to the light to be seen, and it was reversed left to right; sitters were often startled to meet themselves as their friends saw them.",
        D: " The negative also made a new kind of error possible: a print could be retouched, combined with another, or reversed, and the argument about whether a photograph could lie began almost as soon as one could be copied.",
        E: " Portrait painters were the first to feel it: within a decade the miniature, painted on ivory for a locket, had all but disappeared, its customers gone to the studios where a likeness cost a fraction of the price and took a minute rather than a week.",
        F: " The film was a strip of flexible celluloid, an idea Eastman borrowed and improved, and it is the same strip — narrowed, perforated and run past a lens at sixteen frames a second — that a few years later made the cinema possible."
      },
      23: { /* Defying Gravity — 628 → ~810 */
        A: " The station itself is an assembly of modules launched by several countries over a decade and joined in orbit, a structure the length of a football field that, at dawn or dusk, is visible from the ground as a bright, fast-moving star.",
        B: " Sleep is scheduled rather than felt: the crew sleep in bags strapped to a wall, in cabins the size of a wardrobe, with their arms drifting in front of them, and most report that the first nights are spent waiting for a sense of lying down that never comes.",
        C: " Nutrition is monitored as closely as exercise, because calcium leaving the bones passes through the kidneys, where it raises the risk of stones; the diet is adjusted, and the crew are weighed by measuring how their bodies oscillate on a spring, since scales are useless.",
        E: " The findings prompted a second, larger programme in which routine samples of blood, saliva and skin are taken from every crew member before, during and after a mission, building a record that will take many flights to interpret."
      },
      24: { /* The Ultimate Trip — 638 → ~820 */
        A: " The distances also decide the mood of the mission. For most of the outbound flight the earth is a point of light that shrinks day by day, until it is one star among many; no crew has ever watched its home planet vanish, and psychologists are unsure what the sight will do.",
        B: " Solar storms add a second hazard on top of the steady background: a large one can deliver, in hours, a dose that would otherwise take months to accumulate, and the only defence is a small, densely shielded shelter into which the crew must retreat at short notice.",
        D: " The rover experiment mattered less for the quantity than for the principle it established: that the raw material of a return journey lies in the Martian air itself, and that the factory can be built, tested and repaired by machines before a single person arrives.",
        E: " Boredom, it turned out, was more dangerous than fear. Tasks that had been performed perfectly for a hundred days were skipped or done badly on the hundred and first, not because they were hard but because nothing seemed to depend on them."
      }
    },
    ENG_READING_3: {
      15: { /* China's Grand Canal — 651 → ~810 */
        A: " Where the rivers are the natural grain of the country, the canal is a stitch across it, and its route on a map looks less like a river than like a decision.",
        C: " The system had to run on time as well as at scale. Barges were assigned to fixed convoys, each convoy to a fixed month, so that the northern granaries were refilled before winter closed the water; a late fleet meant not inconvenience but hunger in the capital.",
        D: " The locks were accompanied by a second, quieter invention — reservoirs on the summit stretches, fed by diverted streams, which kept the highest sections full through the dry season and made the whole route a managed machine rather than a chain of accidents.",
        F: " The two programmes even share a critic's objection: that moving a resource across half a country, by the force of the state, treats a symptom and leaves the cause — where people choose to live — untouched."
      },
      11: { /* The World's Favorite Drug — 637 → ~810 */
        B: " Regular users complicate the picture further. Faced with receptors that are constantly blocked, the brain grows more of them, so that the same cup produces a smaller effect and the absence of a cup produces a larger one. Tolerance and dependence are, at the level of the cell, the same adjustment.",
        C: " The variation has a practical use: people who know which group they belong to can time their last cup accordingly, and a growing number of sleep clinics ask about caffeine before they ask about anything else.",
        E: " The coffeehouse also changed the shape of a working life. For the price of a cup, a merchant could read the newspapers, hear the shipping news and meet his creditors, and several of London's great institutions — an insurance market, a stock exchange — began as tables in particular coffeehouses.",
        F: " Timing matters as much as quantity: the same dose taken in the morning and taken after four in the afternoon are, in their effect on the night, different drugs."
      }
    }
  };

  /* Bir marta qo'llash. Matn fayllari o'zgarmaydi — faqat xotiradagi obyekt. */
  window.applyReadingExt = function () {
    var n = 0;
    Object.keys(EXT).forEach(function (g) {
      var list = window[g];
      if (!Array.isArray(list)) return;
      list.forEach(function (p) {
        var ext = EXT[g][p.n];
        if (!ext || p._extended) return;
        (p.paras || []).forEach(function (para) {
          if (ext[para.id]) { para.t = para.t.replace(/\s+$/, '') + ext[para.id]; n++; }
        });
        p._extended = true;
      });
    });
    return n;
  };
  window.ENG_READING_EXT = EXT;
  window.applyReadingExt();
})();
