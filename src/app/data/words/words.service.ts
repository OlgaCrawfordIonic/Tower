import { Injectable } from '@angular/core';
import { Word, PartOfSpeech, Definition } from './words.model';
import { BehaviorSubject, take,map,tap } from 'rxjs';


 @Injectable({
  providedIn: 'root'
})
export class WordsService {
   private _words=new BehaviorSubject<Word[]>([]);
   private _wordsB1=new BehaviorSubject<Word[]>([]);
    private _wordsB2=new BehaviorSubject<Word[]>([]);
     private _wordsC1=new BehaviorSubject<Word[]>([]);
      private _wordsC2=new BehaviorSubject<Word[]>([]);
   private _subsetWords = new BehaviorSubject<Word[]>([]);

   constructor() { 
    // You can initialize the BehaviorSubject with the initial words data
    this.initialiseWords(); this.initialiseWords();
  }

 


  initialiseWords(){
   const words: Word[] = [
   new Word(
    14,
    'framework',
    [
      new PartOfSpeech('noun', [
        new Definition('an essential supporting structure of a building, vehicle, or object.', [
          'The steel framework of the building was visible during construction.',
          'The framework of the bridge needed reinforcement to ensure its stability.',
        ]),
        new Definition('a basic structure underlying a system, concept, or text.', [
          'The legal framework of the country ensures justice and equality for all.',
          'The framework for the new software was designed to be scalable and flexible.',
        ]),
        new Definition('a set of ideas, rules, or beliefs from which something is developed, or on which decisions are based.', [
          'The framework for the project was established during the initial meetings.',
          'His ideas provided a framework for understanding modern politics.',
        ])
      ])
    ]
  ),
  new Word(
    15,
    'alliance',
    [
      new PartOfSpeech('noun', [
        new Definition('a union or association formed for mutual benefit, especially between countries or organizations.', [
          'The two nations formed a military alliance to protect against common threats.',
          'Several environmental groups have formed an alliance to tackle climate change.',
        ]),
        new Definition('a relationship based on similarity of interests, nature, or qualities.', [
          'There is a natural alliance between the two companies due to their shared goals.',
          'The political alliance between the parties was unexpected.',
        ]),
        new Definition('the state of being joined or associated.', [
          'The alliance between the two families was cemented by marriage.',
          'They entered into an alliance to increase their market share.',
        ])
      ])
    ]
  ),
  new Word(
    16,
    'adamant',
    [
      new PartOfSpeech('adjective', [
        new Definition('refusing to be persuaded or to change one’s mind.', [
          'She was adamant that she would not attend the party, despite their pleas.',
          'He remained adamant on his decision to resign from the position.',
        ]),
        new Definition('unshakable or immovable, especially in opposition.', [
          'The leader was adamant in his stance against corruption.',
          'They were adamant that the project should proceed as planned.',
        ])
      ]),
      new PartOfSpeech('noun', [
        new Definition('a legendary rock or mineral to which many, often contradictory, properties were attributed, formerly associated with diamond or lodestone.', [
          'The shield was said to be made of adamant, an indestructible material.',
          'In ancient myths, adamant was believed to be unbreakable.',
        ])
      ])
    ]
  ),
  new Word(
    17,
    'alfresco',
    [
      new PartOfSpeech('adjective', [
        new Definition('done or eaten in the open air.', [
          'We enjoyed an alfresco lunch on the patio.',
          'The restaurant offers alfresco dining with a view of the garden.',
        ])
      ]),
      new PartOfSpeech('adverb', [
        new Definition('in the open air.', [
          'They decided to dine alfresco at the rooftop café.',
          'We had breakfast alfresco while enjoying the morning breeze.',
        ])
      ])
    ]
  ),
  new Word(
    18,
    'diligent',
    [
      new PartOfSpeech('adjective', [
        new Definition('having or showing care and conscientiousness in one’s work or duties.', [
          'She is a diligent student, always completing her assignments on time.',
          'The detective was diligent in his investigation, leaving no stone unturned.',
        ]),
        new Definition('characterized by steady, earnest, and energetic effort.', [
          'The team worked diligently to meet the project deadline.',
          'His diligent efforts were recognized with a promotion.',
        ])
      ])
    ]
  ),
  new Word(
    19,
    'discern',
    [
      new PartOfSpeech('verb', [
        new Definition('perceive or recognize (something).', [
          'She could discern a faint light in the distance.',
          'It is difficult to discern any difference between the two policies.',
        ]),
        new Definition('distinguish (someone or something) with difficulty by sight or with the other senses.', [
          'He could barely discern the outline of the mountain through the fog.',
          'The dog could discern its owner’s footsteps from a distance.',
        ])
      ])
    ]
  ),
  new Word(
    20,
    'distinctive',
    [
      new PartOfSpeech('adjective', [
        new Definition('characteristic of one person or thing, and so serving to distinguish it from others.', [
          'The distinctive aroma of fresh coffee filled the room.',
          'Her voice is quite distinctive, making her easily recognizable on the radio.',
        ]),
        new Definition('having a quality or characteristic that makes something different and easily noticed.', [
          'The building has a distinctive architecture that stands out in the cityscape.',
          'He wore a distinctive hat that made him easy to spot in the crowd.',
        ])
      ])
    ]
  ),
  new Word(
    21,
    'distinguish',
    [
      new PartOfSpeech('verb', [
        new Definition('recognize or treat (someone or something) as different.', [
          'He could not distinguish between right and wrong in the complex situation.',
          'The twins are so alike that it is difficult to distinguish one from the other.',
        ]),
        new Definition('perceive or point out a difference.', [
          'It was hard to distinguish the two colors in the dim light.',
          'She could distinguish the subtle differences in flavor between the two dishes.',
        ]),
        new Definition('manage to discern (something barely perceptible).', [
          'He could just distinguish the faint outline of the ship on the horizon.',
          'In the distance, she could barely distinguish the figure approaching.',
        ]),
        new Definition('make oneself prominent and worthy of respect through one’s achievements.', [
          'She distinguished herself as an expert in the field of molecular biology.',
          'He distinguished himself in the competition, earning first place.',
        ])
      ])
    ]
  ),
  new Word(
    22,
    'emerge',
    [
      new PartOfSpeech('verb', [
        new Definition('move out of or away from something and become visible.', [
          'The deer emerged from the forest and walked into the clearing.',
          'The sun emerged from behind the clouds, brightening the day.',
        ]),
        new Definition('become apparent, important, or prominent.', [
          'New evidence has emerged that could change the outcome of the trial.',
          'After years of hard work, she emerged as a leader in the industry.',
        ]),
        new Definition('recover from or survive a difficult or demanding situation.', [
          'He emerged from the crisis stronger and more determined.',
          'The company emerged from bankruptcy with a new strategy.',
        ])
      ])
    ]
  ),
  new Word(
    23,
    'empower',
    [
      new PartOfSpeech('verb', [
        new Definition('give (someone) the authority or power to do something.', [
          'The new law will empower local governments to handle environmental issues.',
          'She empowered her team by giving them the autonomy to make decisions.',
        ]),
        new Definition('make (someone) stronger and more confident, especially in controlling their life and claiming their rights.', [
          'Education can empower individuals to improve their lives and contribute to their communities.',
          'The program is designed to empower women through skill development and financial support.',
        ])
      ])
    ]
  ),
  new Word(
    24,
    'prejudice',
    [
      new PartOfSpeech('noun', [
        new Definition('preconceived opinion that is not based on reason or actual experience.', [
          'He had a prejudice against people of different races.',
          'Her comments revealed a deep-seated prejudice towards immigrants.',
        ]),
        new Definition('dislike, hostility, or unjust behavior deriving from preconceived and unfounded opinions.', [
          'The policy was created to combat prejudice in the workplace.',
          'His prejudice against women prevented him from hiring qualified female candidates.',
        ])
      ]),
      new PartOfSpeech('verb', [
        new Definition('give rise to prejudice in (someone); make biased.', [
          'The media coverage prejudiced the jury against the defendant.',
          'She was prejudiced by her upbringing to distrust outsiders.',
        ]),
        new Definition('cause harm to (a state of affairs).', [
          'The lack of evidence prejudiced the investigation.',
          'His actions have prejudiced the outcome of the negotiations.',
        ])
      ])
    ]
  ),
  new Word(
    25,
    'bias',
    [
      new PartOfSpeech('noun', [
        new Definition('prejudice in favor of or against one thing, person, or group compared with another, usually in a way considered to be unfair.', [
          'The judge was accused of bias in favor of the defendant.',
          'Her bias towards her own department was evident in her decisions.',
        ]),
        new Definition('a concentration on or interest in one particular area or subject.', [
          'The professor has a strong bias towards European history in his lectures.',
          'There is a noticeable bias in the media coverage towards certain political parties.',
        ])
      ]),
      new PartOfSpeech('verb', [
        new Definition('cause to feel or show inclination or prejudice for or against someone or something.', [
          'The article was clearly biased in favor of the government’s policies.',
          'His upbringing biased him against taking risks in his career.',
        ])
      ])
    ]),
    new Word(
      26,
      'compile',
      [
        new PartOfSpeech('verb', [
          new Definition('produce (a list or book) by assembling information collected from other sources.', [
            'She compiled a list of the most influential books of the century.',
            'The researchers compiled data from various studies for their report.',
          ]),
          new Definition('collect (information) in order to produce something.', [
            'He spent months compiling the information needed for his dissertation.',
            'The editor compiled various articles into a single publication.',
          ]),
          new Definition('convert (a program) into a machine-code or lower-level form in which the program can be executed.', [
            'The software developer compiled the code before running it on the server.',
            'It took several minutes to compile the program on the old computer.',
          ])
        ])
      ]
    ),
    new Word(
      27,
      'announce',
      [
        new PartOfSpeech('verb', [
          new Definition('make a public and typically formal declaration about a fact, occurrence, or intention.', [
            'The company will announce its new product line next week.',
            'She announced her candidacy for mayor at the rally.',
          ]),
          new Definition('give information about something in a public or formal way.', [
            'They announced the winner of the competition on live television.',
            'The teacher announced the results of the test to the class.',
          ]),
          new Definition('introduce or present (someone or something).', [
            'The host announced the next act at the concert.',
            'He was announced as the keynote speaker at the conference.',
          ])
        ])
      ]
    ),
     new Word(
      28,
      'flexible',
      [
        new PartOfSpeech('adjective', [
          new Definition('capable of bending easily without breaking.', [
            'The flexible branches of the tree swayed in the wind.',
            'She uses a flexible hose to water her garden.',
          ]),
          new Definition('able to be easily modified to respond to altered circumstances.', [
            'The company offers flexible working hours to accommodate different lifestyles.',
            'His schedule is flexible enough to allow for last-minute changes.',
          ]),
          new Definition('ready and able to change so as to adapt to different circumstances.', [
            'She is very flexible in her approach to problem-solving.',
            'The plan was flexible, allowing for adjustments as needed.',
          ])
        ])
      ]
    ),
     new Word(
      29,
      'staff',
      [
        new PartOfSpeech('noun', [
          new Definition('all the people employed by a particular organization.', [
            'The hospital staff worked tirelessly to care for the patients.',
            'The school is hiring additional staff for the new academic year.',
          ]),
          new Definition('a group of officers assisting a commander, or a manager or director in carrying out their duties.', [
            'The general’s staff coordinated the battle plans.',
            'The CEO met with her senior staff to discuss the company’s strategy.',
          ]),
          new Definition('a long stick used as a support for walking or as a weapon.', [
            'The shepherd carried a staff to help guide his flock.',
            'The hiker used a sturdy staff to navigate the rough terrain.',
          ])
        ]),
        new PartOfSpeech('verb', [
          new Definition('provide (an organization or business) with staff.', [
            'The company is staffed by highly trained professionals.',
            'They staffed the event with volunteers from the community.',
          ])
        ])
      ]
    ),
     new Word(
      30,
      'provide',
      [
        new PartOfSpeech('verb', [
          new Definition('make available for use; supply.', [
            'The company provides health insurance to all of its employees.',
            'They provided us with all the necessary information.',
          ]),
          new Definition('equip or supply someone with (something useful or necessary).', [
            'The school provides its students with the latest technology.',
            'He provided his team with the tools they needed to succeed.',
          ]),
          new Definition('make adequate preparation for (a possible event).', [
            'We must provide for the possibility of an early winter.',
            'The contract provides for a review after one year.',
          ])
        ])
      ]
    ),
    new Word(
      31,
      'eloquent',
      [
        new PartOfSpeech('adjective', [
          new Definition('fluent or persuasive in speaking or writing.', [
            'The politician gave an eloquent speech that moved the audience to tears.',
            'Her eloquent writing captures the reader’s attention from the first sentence.',
          ]),
          new Definition('clearly expressing or indicating something.', [
            'His eyes were eloquent, revealing the depth of his feelings.',
            'The silence in the room was eloquent, speaking volumes about the tension present.',
          ])
        ])
      ]
    ),
     new Word(
      32,
      'ambitious',
      [
        new PartOfSpeech('adjective', [
          new Definition('having or showing a strong desire and determination to succeed.', [
            'She is an ambitious young professional aiming to climb the corporate ladder.',
            'His ambitious plans for expanding the business impressed the investors.',
          ]),
          new Definition('intended to satisfy high aspirations and therefore difficult to achieve.', [
            'The company’s ambitious goals for the year include doubling its revenue.',
            'They embarked on an ambitious project to build a new city park.',
          ])
        ])
      ]
    ),
    new Word(
      33,
      'compose',
      [
        new PartOfSpeech('verb', [
          new Definition('write or create (a work of art, especially music or poetry).', [
            'She composed a beautiful sonnet for her mother’s birthday.',
            'Beethoven composed many of his symphonies while he was deaf.',
          ]),
          new Definition('form (a whole) by ordering or arranging the parts, especially in an artistic way.', [
            'The artist carefully composed the painting to achieve the desired effect.',
            'He composed a team of experts to tackle the problem.',
          ]),
          new Definition('calm or settle (oneself or one’s features or thoughts).', [
            'She took a deep breath to compose herself before speaking.',
            'After the shock, it took him a few minutes to compose his thoughts.',
          ])
        ])
      ]
    ),
    new Word(
      34,
      'abundance',
      [
        new PartOfSpeech('noun', [
          new Definition('a very large quantity of something.', [
            'The region is known for its abundance of natural resources.',
            'There was an abundance of food at the harvest festival.',
          ]),
          new Definition('the state or condition of having a copious quantity of something; plentifulness.', [
            'The country’s economy grew thanks to an abundance of skilled labor.',
            'They enjoyed an abundance of wealth and luxury.',
          ])
        ])
      ]
    ),
    new Word(
      35,
      'fulfill',
      [
        new PartOfSpeech('verb', [
          new Definition('bring to completion or reality; achieve or realize (something desired, promised, or predicted).', [
            'She worked hard to fulfill her dream of becoming a doctor.',
            'The company failed to fulfill the terms of the contract.',
          ]),
          new Definition('carry out (a task, duty, or role) as required, pledged, or expected.', [
            'He fulfilled his role as a leader with dedication and integrity.',
            'The workers fulfilled their duties efficiently.',
          ]),
          new Definition('satisfy or meet (a requirement or condition).', [
            'This product will fulfill all your needs for a healthy diet.',
            'The job posting fulfills all the necessary criteria.',
          ])
        ])
      ]
    ),
     new Word(
      36,
      'require',
      [
        new PartOfSpeech('verb', [
          new Definition('need for a particular purpose.', [
            'This job requires a high level of expertise.',
            'The project requires careful planning and execution.',
          ]),
          new Definition('make necessary.', [
            'The law requires companies to provide safe working conditions.',
            'The task will require more time than initially anticipated.',
          ]),
          new Definition('officially request or demand something.', [
            'All visitors are required to show identification at the entrance.',
            'The court requires you to appear in person for the hearing.',
          ])
        ])
      ]
    ),
    new Word(
      37,
      'accountable',
      [
        new PartOfSpeech('adjective', [
          new Definition('required or expected to justify actions or decisions; responsible.', [
            'The manager is accountable for the performance of her team.',
            'Public officials must be accountable to the people they serve.',
          ]),
          new Definition('subject to the obligation to report, explain, or justify something; answerable.', [
            'Employees are held accountable for achieving their targets.',
            'The government should be accountable for its actions.',
          ])
        ])
      ]
    ),
     new Word(
      38,
      'claim',
      [
        new PartOfSpeech('verb', [
          new Definition('state or assert that something is the case, typically without providing evidence or proof.', [
            'She claimed that she had been cheated out of her inheritance.',
            'The company claims that its products are the best in the market.',
          ]),
          new Definition('demand or request (something) as one’s due.', [
            'He claimed the right to a fair trial.',
            'They claimed compensation for the damage caused by the storm.',
          ]),
          new Definition('formally request or apply for (something) after satisfying the appropriate conditions.', [
            'You can claim your prize at the reception desk.',
            'She claimed unemployment benefits after losing her job.',
          ])
        ]),
        new PartOfSpeech('noun', [
          new Definition('an assertion that something is true.', [
            'The scientist’s claim was supported by substantial evidence.',
            'The court rejected his claim of innocence.',
          ]),
          new Definition('a demand or request for something considered one’s due.', [
            'They filed a claim for damages after the accident.',
            'He made a claim to the throne.',
          ])
        ])
      ]
    ),
     new Word(
      39,
      'refuse',
      [
        new PartOfSpeech('verb', [
          new Definition('indicate or show that one is not willing to do something.', [
            'She refused to answer the question.',
            'He refused their offer politely but firmly.',
          ]),
          new Definition('indicate that one is unwilling to accept or grant something offered or requested.', [
            'The bank refused the loan application.',
            'He refused permission for them to enter the property.',
          ])
        ]),
        new PartOfSpeech('noun', [
          new Definition('matter thrown away or rejected as worthless; rubbish.', [
            'The city collects household refuse every Thursday.',
            'Refuse was scattered across the street after the event.',
          ])
        ])
      ]
    ),
    new Word(
      40,
      'insurance',
      [
        new PartOfSpeech('noun', [
          new Definition('a practice or arrangement by which a company or government agency provides a guarantee of compensation for specified loss, damage, illness, or death in return for payment of a premium.', [
            'She bought health insurance to cover her medical expenses.',
            'Car insurance is mandatory in most countries.',
          ]),
          new Definition('a thing providing protection against a possible eventuality.', [
            'The umbrella was his insurance against the rain.',
            'They took out extra insurance on their house in case of a flood.',
          ])
        ])
      ]
    ),
     new Word(
      41,
      'negotiate',
      [
        new PartOfSpeech('verb', [
          new Definition('try to reach an agreement or compromise by discussion with others.', [
            'The two countries are negotiating a peace treaty.',
            'She negotiated a higher salary during the job offer process.',
          ]),
          new Definition('find a way over or through (an obstacle or difficult path).', [
            'He carefully negotiated the steep mountain path.',
            'The driver had to negotiate a series of sharp turns on the road.',
          ]),
          new Definition('transfer (a check, bill, or other document) to the legal ownership of another person.', [
            'The banker negotiated the check on behalf of the client.',
            'The bond was negotiated to another party after the sale.',
          ])
        ])
      ]
    ),
    new Word(
      42,
      'evidently',
      [
        new PartOfSpeech('adverb', [
          new Definition('in a way that is clearly seen or understood; obviously.', [
            'She was evidently upset by the news.',
            'He is evidently a man of great wealth and influence.',
          ]),
          new Definition('according to the available evidence.', [
            'Evidently, the project will be delayed by several weeks.',
            'The results of the test were evidently conclusive.',
          ])
        ])
      ]
    ),
    new Word(
      43,
      'essence',
      [
        new PartOfSpeech('noun', [
          new Definition('the intrinsic nature or indispensable quality of something, especially something abstract, that determines its character.', [
            'The essence of democracy is the right to vote.',
            'In essence, the two proposals are quite similar.',
          ]),
          new Definition('a property or group of properties of something without which it would not exist or be what it is.', [
            'Patience is the very essence of good teaching.',
            'Freedom of speech is of the essence in a democratic society.',
          ]),
          new Definition('an extract or concentrate obtained from a particular plant or other matter and used for flavoring or scent.', [
            'She added a few drops of vanilla essence to the cake batter.',
            'Lavender essence is often used in aromatherapy.',
          ])
        ])
      ]
    ),
    new Word(
      44,
      'treacherous',
      [
        new PartOfSpeech('adjective', [
          new Definition('guilty of or involving betrayal or deception.', [
            'He was seen as treacherous after betraying his closest allies.',
            'The treacherous spy leaked government secrets to the enemy.',
          ]),
          new Definition('hazardous because of presenting hidden or unpredictable dangers.', [
            'The hikers struggled to navigate the treacherous mountain path.',
            'Driving in the snow can be treacherous if you are not careful.',
          ])
        ])
      ]
    ),
    new Word(
      45,
      'reconcile',
      [
        new PartOfSpeech('verb', [
          new Definition('restore friendly relations between.', [
            'After years of conflict, the two brothers finally reconciled.',
            'The mediator helped to reconcile the differences between the two parties.',
          ]),
          new Definition('make (one account) consistent with another, especially by allowing for transactions begun but not yet completed.', [
            'It’s important to reconcile your bank statements at the end of each month.',
            'She reconciled the financial records to match the transactions.',
          ]),
          new Definition('cause to coexist in harmony; make or show to be compatible.', [
            'He couldn’t reconcile his duties as a father with his demanding work schedule.',
            'The artist reconciled modern techniques with traditional methods in his latest piece.',
          ])
        ])
      ]
    ),
    new Word(
      46,
      'acclaimed',
      [
        new PartOfSpeech('adjective', [
          new Definition('publicly praised; celebrated.', [
            'The author is acclaimed for her powerful storytelling.',
            'The film was critically acclaimed and received multiple awards.',
          ])
        ])
      ]
    ),
     new Word(
      47,
      'ridiculous',
      [
        new PartOfSpeech('adjective', [
          new Definition('deserving or inviting derision or mockery; absurd.', [
            'It’s ridiculous to think that anyone would believe such a story.',
            'The price they were asking for the old car was ridiculous.',
          ])
        ])
      ]
    ),
    new Word(
      80,
      'aroma',
      [
        new PartOfSpeech('noun', [
          new Definition('a distinctive, typically pleasant smell.', [
            'The aroma of freshly baked bread filled the kitchen.',
            'The aroma of coffee woke me up in the morning.',
          ])
        ])
      ]
    ),
    
  new Word(
      48,
      'distinguished',
      [
        new PartOfSpeech('adjective', [
          new Definition('successful, authoritative, and commanding great respect.', [
            'He is a distinguished professor known for his groundbreaking research.',
            'The distinguished guest gave a speech at the awards ceremony.',
          ])
        ])
      ]
    ),
   new Word(
      49,
      'abandoned',
      [
        new PartOfSpeech('adjective', [
          new Definition('having been deserted or left.', [
            'The abandoned house had been empty for years.',
            'She felt abandoned when her friends moved away.',
          ])
        ])
      ]
    ),
     new Word(
      50,
      'accelerate',
      [
        new PartOfSpeech('verb', [
          new Definition('begin to move more quickly.', [
            'The car began to accelerate as it reached the highway.',
            'She needs to accelerate her studies if she wants to graduate on time.',
          ])
        ])
      ]
    ),
     new Word(
      51,
      'accomplished',
      [
        new PartOfSpeech('adjective', [
          new Definition('highly trained or skilled.', [
            'He is an accomplished pianist known for his performances.',
            'The accomplished writer has published many best-selling novels.',
          ])
        ])
      ]
    ),
     new Word(
      52,
      'accountability',
      [
        new PartOfSpeech('noun', [
          new Definition('the fact or condition of being accountable; responsibility.', [
            'The company emphasizes accountability in all its operations.',
            'The manager stressed the importance of accountability among the team members.',
          ])
        ])
      ]
    ),
     new Word(
      53,
      'achieve',
      [
        new PartOfSpeech('verb', [
          new Definition('successfully bring about or reach (a desired objective or result) by effort, skill, or courage.', [
            'She worked hard to achieve her goals.',
            'He achieved success after years of dedication and hard work.',
          ])
        ])
      ]
    ),
   new Word(
      54,
      'adjust',
      [
        new PartOfSpeech('verb', [
          new Definition('alter or move (something) slightly in order to achieve the desired fit, appearance, or result.', [
            'She adjusted the seat to make it more comfortable.',
            'You need to adjust your expectations to the new situation.',
          ])
        ])
      ]
    ),
    new Word(
      55,
      'audacious',
      [
        new PartOfSpeech('adjective', [
          new Definition('showing a willingness to take surprisingly bold risks.', [
            'Her audacious plan to climb the highest mountain was met with skepticism.',
            'The audacious entrepreneur invested all his savings into his startup.',
          ]),
          new Definition('showing an impudent lack of respect.', [
            'The audacious comment shocked everyone at the meeting.',
            'His audacious behavior toward the elders was frowned upon.',
          ])
        ])
      ]
    ),  
  new Word(
      56,
      'auspicious',
      [
        new PartOfSpeech('adjective', [
          new Definition('conducive to success; favorable.', [
            'The start of the project was marked by auspicious signs.',
            'It was an auspicious day for a wedding, with clear skies and warm weather.',
          ])
        ])
      ]
    ),
    new Word(
      58,
      'austere',
      [
        new PartOfSpeech('adjective', [
          new Definition('severe or strict in manner, attitude, or appearance.', [
            'Her austere demeanor made her students feel intimidated.',
            'The monk lived an austere life of discipline and simplicity.',
          ]),
          new Definition('having no comforts or luxuries; harsh or ascetic.', [
            'The austere living conditions in the remote village were challenging.',
            'The room was austere, with just a bed and a chair for furniture.',
          ])
        ])
      ]
    ),
    new Word(
      59,
      'authorise',
      [
        new PartOfSpeech('verb', [
          new Definition('give official permission for or approval to (an undertaking or agent).', [
            'The manager authorised the purchase of new equipment for the office.',
            'He was authorised to make decisions on behalf of the company.',
          ])
        ])
      ]
    ),
     new Word(
      60,
      'autonomy',
      [
        new PartOfSpeech('noun', [
          new Definition('the right or condition of self-government.', [
            'The country achieved full autonomy after years of struggle.',
            'University students often seek greater autonomy in their decision-making.',
          ]),
          new Definition('freedom from external control or influence; independence.', [
            'The manager was given autonomy to make key business decisions.',
            'Achieving personal autonomy is an important step in adulthood.',
          ])
        ])
      ]
    ),
     new Word(
      61,
      'avid',
      [
        new PartOfSpeech('adjective', [
          new Definition('having or showing a keen interest in or enthusiasm for something.', [
            'He is an avid reader, finishing several books a week.',
            'She is an avid traveler, always looking for the next adventure.',
          ])
        ])
      ]
    ),
     new Word(
      62,
      'award',
      [
        new PartOfSpeech('noun', [
          new Definition('a prize or other mark of recognition given in honor of an achievement.', [
            'He received an award for his outstanding performance at work.',
            'The film won the prestigious award at the international festival.',
          ])
        ]),
        new PartOfSpeech('verb', [
          new Definition('give or order the giving of (something) as an official payment, compensation, or prize.', [
            'The committee awarded her the first prize in the competition.',
            'The contract was awarded to the most qualified bidder.',
          ])
        ])
      ]
    ),
    new Word(
      63,
      'axiom',
      [
        new PartOfSpeech('noun', [
          new Definition('a statement or proposition that is regarded as being established, accepted, or self-evidently true.', [
            'The idea that "all men are created equal" is considered an axiom of democracy.',
            'One of the central axioms of physics is that energy is conserved.',
          ])
        ])
      ]
    ),
    new Word(
      64,
      'advice',
      [
        new PartOfSpeech('noun', [
          new Definition('guidance or recommendations offered with regard to prudent future action.', [
            'She gave me some good advice on how to handle the situation.',
            'His advice was to always follow your instincts.',
          ])
        ])
      ]
    ),
    new Word(
      65,
      'adapt',
      [
        new PartOfSpeech('verb', [
          new Definition('make (something) suitable for a new use or purpose; modify.', [
            'The company had to adapt its marketing strategy in response to changing customer behavior.',
            'He adapted quickly to the new environment.',
          ]),
          new Definition('become adjusted to new conditions.', [
            'It took time to adapt to the new climate.',
            'The students had to adapt to the new schedule.',
          ])
        ])
      ]
    ),
    new Word(
      66,
      'advantage',
      [
        new PartOfSpeech('noun', [
          new Definition('a condition or circumstance that puts one in a favorable or superior position.', [
            'His height gives him an advantage in basketball.',
            'The new software provides a competitive advantage to the company.',
          ])
        ])
      ]
    ),
     new Word(
      67,
      'admire',
      [
        new PartOfSpeech('verb', [
          new Definition('regard (an object, quality, or person) with respect or warm approval.', [
            'I really admire her dedication to the cause.',
            'He stood back to admire the beautiful sunset.',
          ])
        ])
      ]
    ),
     new Word(
      68,
      'advocate',
      [
        new PartOfSpeech('noun', [
          new Definition('a person who publicly supports or recommends a particular cause or policy.', [
            'She is a well-known advocate for human rights.',
            'As an advocate of environmental protection, he lobbies for stricter laws.',
          ])
        ]),
        new PartOfSpeech('verb', [
          new Definition('publicly recommend or support.', [
            'He advocates for better working conditions for laborers.',
            'The doctor advocates for healthier lifestyle choices.',
          ])
        ])
      ]
    ),
    new Word(
      69,
      'affinity',
      [
        new PartOfSpeech('noun', [
          new Definition('a spontaneous or natural liking or sympathy for someone or something.', [
            'She felt an affinity for the countryside and its quiet beauty.',
            'There is a strong affinity between the two companies due to their shared values.',
          ])
        ])
      ]
    ),
     new Word(
      70,
      'agenda',
      [
        new PartOfSpeech('noun', [
          new Definition('a list of items to be discussed at a formal meeting.', [
            'The first item on the agenda is the budget proposal.',
            'We need to set an agenda for tomorrow’s meeting.',
          ]),
          new Definition('an underlying plan or program.', [
            'His real agenda was to gain control of the committee.',
            'The politician’s agenda became clear after the election.',
          ])
        ])
      ]
    ),
    new Word(
      71,
      'alter',
      [
        new PartOfSpeech('verb', [
          new Definition('change or cause to change in character or composition, typically in a comparatively small but significant way.', [
            'He had to alter his plans due to the weather.',
            'The dress needs to be altered to fit better.',
          ])
        ])
      ]
    ),
     new Word(
      72,
      'alternative',
      [
        new PartOfSpeech('noun', [
          new Definition('one of two or more available possibilities.', [
            'We had no alternative but to cancel the event.',
            'The alternative to going by car is taking the train.',
          ])
        ]),
        new PartOfSpeech('adjective', [
          new Definition('available as another possibility or choice.', [
            'They offered an alternative plan for reducing expenses.',
            'The alternative route is longer, but it avoids traffic.',
          ])
        ])
      ]),
       new Word(
        73,
        'approach',
        [
          new PartOfSpeech('verb', [
            new Definition('come near or nearer to (someone or something) in distance or time.', [
              'Winter is approaching quickly.',
              'She approached the stranger to ask for directions.',
            ])
          ]),
          new PartOfSpeech('noun', [
            new Definition('a way of dealing with a situation or problem.', [
              'His approach to solving the issue was creative and effective.',
              'The company is taking a new approach to marketing their product.',
            ])
          ])
        ]
      ),
       new Word(
        74,
        'appropriate',
        [
          new PartOfSpeech('adjective', [
            new Definition('suitable or proper in the circumstances.', [
              'Wearing a suit was not appropriate for the casual event.',
              'She found an appropriate response to the difficult question.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('take (something) for one’s own use, typically without the owner’s permission.', [
              'The government appropriated land for a new highway.',
              'Funds were appropriated to support the new project.',
            ])
          ])
        ]
      ),
      new Word(
        75,
        'approve',
        [
          new PartOfSpeech('verb', [
            new Definition('officially agree to or accept as satisfactory.', [
              'The manager approved the budget for the new project.',
              'Her parents did not approve of her decision to move abroad.',
            ])
          ])
        ]
      ),
      new Word(
        76,
        'aptitude',
        [
          new PartOfSpeech('noun', [
            new Definition('a natural ability to do something.', [
              'She has a natural aptitude for music.',
              'His aptitude for mathematics made him a great engineer.',
            ])
          ])
        ]
      ),
      new Word(
        77,
        'arbitrate',
        [
          new PartOfSpeech('verb', [
            new Definition('reach an authoritative judgment or settlement.', [
              'The judge arbitrated the dispute between the two parties.',
              'They chose to arbitrate rather than go to court.',
            ])
          ])
        ]
      ),
      new Word(
        77,
        'arbitrate',
        [
          new PartOfSpeech('verb', [
            new Definition('reach an authoritative judgment or settlement.', [
              'The judge arbitrated the dispute between the two parties.',
              'They chose to arbitrate rather than go to court.',
            ])
          ])
        ]
      ),
       new Word(
        79,
        'arena',
        [
          new PartOfSpeech('noun', [
            new Definition('a place or scene of activity, debate, or conflict.', [
              'The political arena can be a tough environment to navigate.',
              'Thousands of fans filled the arena to watch the concert.',
            ])
          ])
        ]
      ),
      new Word(
        81,
        'arrange',
        [
          new PartOfSpeech('verb', [
            new Definition('put (things) in a neat, attractive, or required order.', [
              'She arranged the flowers in a vase.',
              'They arranged the furniture to maximize space in the room.',
            ]),
            new Definition('organize or make plans for (an event or activity).', [
              'They arranged a surprise party for her birthday.',
              'We need to arrange a meeting with the client next week.',
            ])
          ])
        ]
      ),
     new Word(
        82,
        'array',
        [
          new PartOfSpeech('noun', [
            new Definition('an impressive display or range of a particular type of thing.', [
              'They presented an array of desserts at the party.',
              'The store has a wide array of products on display.',
            ]),
            new Definition('an ordered arrangement, in particular.', [
              'The data is stored in an array for easy access.',
              'The soldiers stood in a perfect array on the field.',
            ])
          ])
        ]
      ),
      new Word(
        83,
        'articulate',
        [
          new PartOfSpeech('adjective', [
            new Definition('having or showing the ability to speak fluently and coherently.', [
              'She is a highly articulate speaker who engages her audience.',
              'He gave an articulate explanation of the complex topic.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('express (an idea or feeling) fluently and coherently.', [
              'She struggled to articulate her thoughts in the meeting.',
              'He was able to articulate his vision for the project clearly.',
            ])
          ])
        ]
      ),
       new Word(
        84,
        'artistic',
        [
          new PartOfSpeech('adjective', [
            new Definition('having or revealing natural creative skill.', [
              'Her artistic talent is evident in her paintings.',
              'The room was decorated in a very artistic way.',
            ])
          ])
        ]
      ),
      new Word(
        85,
        'assert',
        [
          new PartOfSpeech('verb', [
            new Definition('state a fact or belief confidently and forcefully.', [
              'She asserted her authority during the meeting.',
              'He asserted that he was innocent of the charges.',
            ]),
            new Definition('behave or speak in a confident and forceful manner.', [
              'She asserted herself in the conversation to make her point heard.',
              'He always asserts himself in important discussions.',
            ])
          ])
        ]
      ),
   new Word(
        86,
        'aspect',
        [
          new PartOfSpeech('noun', [
            new Definition('a particular part or feature of something.', [
              'The financial aspect of the project needs more attention.',
              'One aspect of the job I enjoy is the variety of tasks.',
            ])
          ])
        ]
      ),
       new Word(
        87,
        'assertive',
        [
          new PartOfSpeech('adjective', [
            new Definition('having or showing a confident and forceful personality.', [
              'She was assertive in expressing her opinions during the meeting.',
              'An assertive attitude is important for leadership roles.',
            ])
          ])
        ]
      ),
       new Word(
        88,
        'assess',
        [
          new PartOfSpeech('verb', [
            new Definition('evaluate or estimate the nature, ability, or quality of.', [
              'The teacher will assess the students’ progress at the end of the term.',
              'They need to assess the risks before moving forward with the plan.',
            ])
          ])
        ]
      ),
      new Word(
        89,
        'assign',
        [
          new PartOfSpeech('verb', [
            new Definition('allocate (a job or duty).', [
              'She was assigned to handle the marketing campaign.',
              'The teacher will assign homework for the weekend.',
            ])
          ])
        ]
      ),
       new Word(
        90,
        'assist',
        [
          new PartOfSpeech('verb', [
            new Definition('help (someone), typically by doing a share of the work.', [
              'She will assist him in completing the project.',
              'The nurse assisted the doctor during the operation.',
            ])
          ])
        ]
      ),
      new Word(
        91,
        'associate',
        [
          new PartOfSpeech('verb', [
            new Definition('connect (someone or something) with something else in one’s mind.', [
              'She associates that smell with her childhood.',
              'He is often associated with the company’s success.',
            ])
          ]),
          new PartOfSpeech('noun', [
            new Definition('a partner or colleague in business or at work.', [
              'He is a close associate of the company’s CEO.',
              'She is an associate professor at the university.',
            ])
          ])
        ]
      ),
      new Word(
        92,
        'assume',
        [
          new PartOfSpeech('verb', [
            new Definition('suppose to be the case, without proof.', [
              'I assume he is coming to the party, but I haven’t asked him yet.',
              'They assumed the project would be completed on time.',
            ])
          ])
        ]
      ),
      new Word(
        93,
        'assure',
        [
          new PartOfSpeech('verb', [
            new Definition('tell someone something positively or confidently to dispel any doubts they may have.', [
              'He assured her that everything would be fine.',
              'The manager assured the team that their jobs were secure.',
            ])
          ])
        ]
      ),
      new Word(
        94,
        'astound',
        [
          new PartOfSpeech('verb', [
            new Definition('shock or greatly surprise.', [
              'The magician’s tricks astounded the audience.',
              'Her rapid recovery astounded the doctors.',
            ])
          ])
        ]
      ),
       new Word(
        95,
        'astute',
        [
          new PartOfSpeech('adjective', [
            new Definition('having or showing an ability to accurately assess situations or people and turn this to one’s advantage.', [
              'He was an astute businessman who always made profitable decisions.',
              'Her astute observations helped the team find a solution quickly.',
            ])
          ])
        ]
      ),
       new Word(
        96,
        'attention',
        [
          new PartOfSpeech('noun', [
            new Definition('notice taken of someone or something; the regarding of someone or something as interesting or important.', [
              'The teacher caught the students’ attention with an interesting story.',
              'Pay close attention to the instructions.',
            ])
          ])
        ]
      ),
      new Word(
        97,
        'attract',
        [
          new PartOfSpeech('verb', [
            new Definition('cause to come to a place or participate in a venture by offering something of interest, favorable conditions, or opportunities.', [
              'The sale is expected to attract many new customers.',
              'The city hopes to attract more tourists this year.',
            ])
          ])
        ]
      ),
      new Word(
        98,
        'available',
        [
          new PartOfSpeech('adjective', [
            new Definition('able to be used or obtained; at someone’s disposal.', [
              'The book is available in the library.',
              'There are no tickets available for the concert.',
            ])
          ])
        ]
      ),
    new Word(
        99,
        'awe',
        [
          new PartOfSpeech('noun', [
            new Definition('a feeling of reverential respect mixed with fear or wonder.', [
              'She looked at the majestic mountains in awe.',
              'The sight of the Grand Canyon filled them with awe.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('inspire with awe.', [
              'The performers awed the audience with their incredible skills.',
              'The beauty of the sunset awed everyone who saw it.',
            ])
          ])
        ]
      ),
      new Word(
        100,
        'bargain',
        [
          new PartOfSpeech('noun', [
            new Definition('an agreement between two or more parties as to what each party will do for the other.', [
              'They made a bargain to lower the price.',
              'The two companies struck a bargain after lengthy negotiations.',
            ]),
            new Definition('a thing bought or offered for sale more cheaply than is usual or expected.', [
              'The coat was a real bargain at that price.',
              'She found a great bargain during the sales.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('negotiate the terms and conditions of a transaction.', [
              'He bargained with the seller to get a better price.',
              'They were bargaining for hours to reach an agreement.',
            ])
          ])
        ]
      ),
       new Word(
        101,
        'basic',
        [
          new PartOfSpeech('adjective', [
            new Definition('forming an essential foundation or starting point; fundamental.', [
              'She learned the basic principles of mathematics in school.',
              'The course teaches basic computer skills.',
            ])
          ]),
          new PartOfSpeech('noun', [
            new Definition('the essential facts or principles of a subject or skill.', [
              'You need to master the basics before advancing to more complex topics.',
              'The basics of good communication are clarity and brevity.',
            ])
          ])
        ]
      ),
       new Word(
        102,
        'balance',
        [
          new PartOfSpeech('noun', [
            new Definition('an even distribution of weight enabling someone or something to remain upright and steady.', [
              'She lost her balance and fell off the bike.',
              'The gymnast maintained perfect balance throughout her routine.',
            ]),
            new Definition('a condition in which different elements are equal or in the correct proportions.', [
              'Work-life balance is important for mental health.',
              'There needs to be a balance between ambition and realism.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('keep or put (something) in a steady position so that it does not fall.', [
              'He balanced the book on his head.',
              'The cat carefully balanced on the narrow ledge.',
            ]),
            new Definition('offset or compare the value of (one thing) with another.', [
              'It’s important to balance spending with saving.',
              'They need to balance the benefits of the new policy against its costs.',
            ])
          ])
        ]
      ),
   
     new Word(
        104,
        'benchmark',
        [
          new PartOfSpeech('noun', [
            new Definition('a standard or point of reference against which things may be compared or assessed.', [
              'This product sets a new benchmark for quality in the industry.',
              'The company uses the best competitors as benchmarks to improve its own products.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('evaluate or check (something) by comparison with a standard.', [
              'We need to benchmark our performance against the industry average.',
              'The team benchmarked the software against its competitors.',
            ])
          ])
        ]
      ),
      new Word(
        105,
        'benefit',
        [
          new PartOfSpeech('noun', [
            new Definition('an advantage or profit gained from something.', [
              'The new policy offers significant benefits to employees.',
              'One of the benefits of exercise is improved mental health.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('receive an advantage; profit.', [
              'She benefited greatly from the additional training.',
              'The community will benefit from the new healthcare initiative.',
            ])
          ])
        ]
      ),
       new Word(
        106,
        'beneficial',
        [
          new PartOfSpeech('adjective', [
            new Definition('resulting in good; favorable or advantageous.', [
              'Regular exercise is beneficial for your health.',
              'The partnership was beneficial for both companies.',
            ])
          ])
        ]
      ),
       new Word(
        107,
        'bespoke',
        [
          new PartOfSpeech('adjective', [
            new Definition('(of goods, especially clothing) made to order.', [
              'He ordered a bespoke suit for the wedding.',
              'The company specializes in bespoke furniture.',
            ]),
            new Definition('made for a particular customer or user.', [
              'The website offers bespoke services for its clients.',
              'They provided a bespoke solution tailored to the company’s needs.',
            ])
          ])
        ]
      ),
       new Word(
        108,
        'agile',
        [
          new PartOfSpeech('adjective', [
            new Definition('able to move quickly and easily.', [
              'The gymnast was incredibly agile, performing flips effortlessly.',
              'He is as agile as a cat when climbing trees.',
            ]),
            new Definition('able to think and understand quickly.', [
              'She has an agile mind, quickly grasping new concepts.',
              'In today’s fast-changing world, businesses need to be agile to stay competitive.',
            ])
          ])
        ]
      ),
       new Word(
        109,
        'blessing',
        [
          new PartOfSpeech('noun', [
            new Definition('a beneficial thing for which one is grateful; something that brings well-being.', [
              'The new job was a blessing for her and her family.',
              'The sunny weather was a blessing for the picnic.',
            ]),
            new Definition('a prayer asking for divine favor and protection.', [
              'The priest gave his blessing to the couple.',
              'They sought the blessing of their elders before making a big decision.',
            ])
          ])
        ]
      ),
      new Word(
        110,
        'bliss',
        [
          new PartOfSpeech('noun', [
            new Definition('perfect happiness; great joy.', [
              'The newlyweds were in a state of bliss on their honeymoon.',
              'Reading by the fireplace on a winter’s night is pure bliss.',
            ])
          ])
        ]
      ),
       new Word(
        111,
        'blueprint',
        [
          new PartOfSpeech('noun', [
            new Definition('a design plan or other technical drawing.', [
              'The architect showed us the blueprint of the new building.',
              'They followed the blueprint carefully to construct the house.',
            ]),
            new Definition('something that acts as a plan, model, or template.', [
              'Their business strategy serves as a blueprint for success.',
              'The new law provides a blueprint for educational reform.',
            ])
          ])
        ]
      ),
      new Word(
        112,
        'blossom',
        [
          new PartOfSpeech('verb', [
            new Definition('(of a tree or bush) produce flowers or masses of flowers.', [
              'The cherry trees began to blossom in early spring.',
              'The roses are blossoming beautifully this year.',
            ]),
            new Definition('develop or come to a promising stage.', [
              'Their friendship blossomed over time.',
              'The young artist’s talent began to blossom after years of practice.',
            ])
          ]),
          new PartOfSpeech('noun', [
            new Definition('a flower or a mass of flowers on a tree or bush.', [
              'The apple tree is covered in beautiful pink blossoms.',
              'The garden was full of colorful blossoms.',
            ])
          ])
        ]
      ),
      new Word(
        113,
        'boast',
        [
          new PartOfSpeech('verb', [
            new Definition('talk with excessive pride and self-satisfaction about one’s achievements, possessions, or abilities.', [
              'He boasted about his new car to all his friends.',
              'She never misses an opportunity to boast about her children’s accomplishments.',
            ])
          ]),
          new PartOfSpeech('noun', [
            new Definition('a statement in which someone talks about something they have done or own in a way that shows too much pride.', [
              'His boast about winning the award was annoying to his colleagues.',
              'The company’s biggest boast is its exceptional customer service.',
            ])
          ])
        ]
      ),
       new Word(
        114,
        'bold',
        [
          new PartOfSpeech('adjective', [
            new Definition('showing a willingness to take risks; confident and courageous.', [
              'The explorer made a bold decision to venture into the unknown.',
              'She wore a bold red dress to the party.',
            ]),
            new Definition('(of a color, design, or shape) having a strong, vivid, or clear appearance.', [
              'The painting used bold colors to make a statement.',
              'The bold lines in the artwork gave it a dramatic effect.',
            ])
          ])
        ]
      ),
       new Word(
        115,
        'bolster',
        [
          new PartOfSpeech('verb', [
            new Definition('support or strengthen; prop up.', [
              'They bolstered their argument with additional evidence.',
              'The new government policies are intended to bolster the economy.',
            ])
          ]),
          new PartOfSpeech('noun', [
            new Definition('a long, thick pillow that is placed under other pillows for support.', [
              'She used a bolster to support her back while reading.',
              'The bed had a large bolster at the headboard.',
            ])
          ])
        ]
      ),
     new Word(
        116,
        'calculate',
        [
          new PartOfSpeech('verb', [
            new Definition('determine (the amount or number of something) mathematically.', [
              'He calculated the total cost of the project.',
              'The students were asked to calculate the area of the rectangle.',
            ]),
            new Definition('intend (an action) to have a particular effect.', [
              'The marketing campaign was calculated to attract younger customers.',
              'She calculated her words carefully to avoid misunderstanding.',
            ])
          ])
        ]
      ),
       new Word(
        117,
        'caliber',
        [
          new PartOfSpeech('noun', [
            new Definition('the quality of someone’s character or the level of their ability.', [
              'The team needs someone of her caliber to succeed.',
              'He is an artist of the highest caliber.',
            ]),
            new Definition('the internal diameter or bore of a gun barrel.', [
              'The gun was of a small caliber.',
              'They used bullets of a higher caliber for greater accuracy.',
            ])
          ])
        ]
      ),
      new Word(
        118,
        'campaign',
        [
          new PartOfSpeech('noun', [
            new Definition('a series of planned activities that are intended to achieve a particular social, commercial, or political goal.', [
              'The election campaign lasted for several months.',
              'They launched a campaign to raise money for the charity.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('work in an organized and active way toward a particular goal, typically a political or social one.', [
              'She campaigned for better healthcare facilities.',
              'They campaigned tirelessly to improve education standards.',
            ])
          ])
        ]
      ),
      new Word(
        119,
        'candidate',
        [
          new PartOfSpeech('noun', [
            new Definition('a person who applies for a job or is nominated for election.', [
              'She is a strong candidate for the position of manager.',
              'There are several candidates running for mayor.',
            ]),
            new Definition('a person or thing regarded as suitable for or likely to receive a particular fate, treatment, or position.', [
              'This old car is a good candidate for restoration.',
              'He is a candidate for promotion because of his hard work.',
            ])
          ])
        ]
      ),
      new Word(
        120,
        'capable',
        [
          new PartOfSpeech('adjective', [
            new Definition('having the ability, fitness, or quality necessary to do or achieve a specified thing.', [
              'She is capable of handling difficult tasks under pressure.',
              'He is a capable leader who inspires his team.',
            ]),
            new Definition('open to or admitting of something.', [
              'The system is capable of processing large amounts of data.',
              'The car is capable of reaching speeds over 200 km/h.',
            ])
          ])
        ]
      ),
       new Word(
        121,
        'cascade',
        [
          new PartOfSpeech('noun', [
            new Definition('a small waterfall, typically one of several that fall in stages down a steep rocky slope.', [
              'The river formed a beautiful cascade over the rocks.',
              'They admired the cascades while hiking in the mountains.',
            ]),
            new Definition('a large number or amount of something occurring or arriving in rapid succession.', [
              'The announcement triggered a cascade of reactions on social media.',
              'There was a cascade of problems after the system failed.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('(of water) pour downward rapidly and in large quantities.', [
              'The water cascaded over the edge of the cliff.',
              'Her hair cascaded down her back in waves.',
            ]),
            new Definition('pass (something) on to a succession of others.', [
              'The changes were cascaded through the entire organization.',
              'The manager cascaded the new policy updates to all the employees.',
            ])
          ])
        ]
      ),
      new Word(
        122,
        'catalyst',
        [
          new PartOfSpeech('noun', [
            new Definition('a substance that increases the rate of a chemical reaction without itself undergoing any permanent chemical change.', [
              'The enzyme acts as a catalyst in the biochemical reaction.',
              'The platinum served as a catalyst in the chemical process.',
            ]),
            new Definition('a person or thing that precipitates an event.', [
              'The economic crisis served as a catalyst for change in government policies.',
              'Her speech was the catalyst for a wave of protests.',
            ])
          ])
        ]
      ),
       new Word(
        123,
        'categorical',
        [
          new PartOfSpeech('adjective', [
            new Definition('unambiguously explicit and direct.', [
              'She gave a categorical assurance that the project would be completed on time.',
              'He made a categorical statement denying any involvement in the scandal.',
            ])
          ])
        ]
      ),
     new Word(
        124,
        'daring',
        [
          new PartOfSpeech('adjective', [
            new Definition('adventurous or audaciously bold.', [
              'She made a daring attempt to climb the mountain alone.',
              'His daring escape from captivity made headlines.',
            ])
          ]),
          new PartOfSpeech('noun', [
            new Definition('bravery or boldness.', [
              'The firefighter’s daring saved the lives of many people.',
              'The daring of the explorers was truly inspiring.',
            ])
          ])
        ]
      ),
       new Word(
        125,
        'debate',
        [
          new PartOfSpeech('noun', [
            new Definition('a formal discussion on a particular topic in a public meeting or legislative assembly, in which opposing arguments are put forward.', [
              'The candidates had a heated debate on climate change.',
              'The debate over the new policy lasted for hours.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('argue about (a subject), especially in a formal manner.', [
              'They debated the merits of the new law.',
              'The team debated whether they should change their strategy.',
            ])
          ])
        ]
      ),
       new Word(
        126,
        'decide',
        [
          new PartOfSpeech('verb', [
            new Definition('come to a resolution in the mind as a result of consideration.', [
              'She decided to go back to school.',
              'They decided on a date for the wedding.',
            ])
          ])
        ]
      ),
       new Word(
        127,
        'declare',
        [
          new PartOfSpeech('verb', [
            new Definition('say something in a solemn and emphatic manner.', [
              'He declared his love for her.',
              'The government declared a state of emergency.',
            ]),
            new Definition('announce officially or publicly.', [
              'The results of the election were declared late in the evening.',
              'The country declared independence in 1960.',
            ])
          ])
        ]
      ),
      new Word(
        128,
        'dedicate',
        [
          new PartOfSpeech('verb', [
            new Definition('devote (time, effort, or oneself) to a particular task or purpose.', [
              'She dedicated her life to helping others.',
              'He dedicated his book to his late parents.',
            ]),
            new Definition('formally open or unveil (a building or monument).', [
              'The memorial was dedicated in a moving ceremony.',
              'They dedicated the new library to the founder.',
            ])
          ])
        ]
      ),
      new Word(
        129,
        'definite',
        [
          new PartOfSpeech('adjective', [
            new Definition('clearly stated or decided; not vague or doubtful.', [
              'She gave a definite answer to the question.',
              'We need a definite plan before we proceed.',
            ])
          ])
        ]
      ),
       new Word(
        130,
        'delegate',
        [
          new PartOfSpeech('noun', [
            new Definition('a person sent or authorized to represent others, in particular an elected representative sent to a conference.', [
              'Each country sent a delegate to the conference.',
              'The delegate spoke on behalf of the entire group.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('entrust (a task or responsibility) to another person, typically one who is less senior.', [
              'He delegated the task to his assistant.',
              'The manager needs to learn how to delegate effectively.',
            ])
          ])
        ]
      ),
       new Word(
        131,
        'deliberate',
        [
          new PartOfSpeech('adjective', [
            new Definition('done consciously and intentionally.', [
              'The attack was a deliberate act of aggression.',
              'She made a deliberate decision to take a break.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('engage in long and careful consideration.', [
              'The jury deliberated for hours before reaching a verdict.',
              'They deliberated on the best course of action.',
            ])
          ])
        ]
      ),
      new Word(
        132,
        'delicate',
        [
          new PartOfSpeech('adjective', [
            new Definition('very fine in texture or structure; of intricate workmanship or quality.', [
              'The fabric is delicate and must be handled with care.',
              'The artist painted delicate flowers in pastel colors.',
            ]),
            new Definition('easily broken or damaged; fragile.', [
              'The vase is quite delicate and should not be moved often.',
              'Her health is delicate after the illness.',
            ])
          ])
        ]
      ),
       new Word(
        133,
        'delight',
        [
          new PartOfSpeech('noun', [
            new Definition('great pleasure.', [
              'She smiled in delight when she saw the gift.',
              'The children’s laughter was a delight to hear.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('please (someone) greatly.', [
              'The performance delighted the audience.',
              'The beautiful view delighted them.',
            ])
          ])
        ]
      ),
     new Word(
        134,
        'descriptive',
        [
          new PartOfSpeech('adjective', [
            new Definition('serving or seeking to describe; describing or classifying in an objective and non-judgmental way.', [
              'The book provides a descriptive account of the city’s history.',
              'She used descriptive language to paint a vivid picture in the reader’s mind.',
            ])
          ])
        ]
      ),
      new Word(
        135,
        'deserve',
        [
          new PartOfSpeech('verb', [
            new Definition('do something or have or show qualities worthy of (reward or punishment).', [
              'She worked hard and deserved the promotion.',
              'After all his efforts, he deserves some rest.',
            ])
          ])
        ]
      ),
      new Word(
        136,
        'design',
        [
          new PartOfSpeech('noun', [
            new Definition('a plan or drawing produced to show the look and function or workings of a building, garment, or other object before it is made.', [
              'The architect showed us the design of the new house.',
              'She created a beautiful design for the dress.',
            ]),
            new Definition('purpose or planning that exists behind an action, fact, or object.', [
              'The design of the experiment was flawed.',
              'There is a clear design behind their marketing strategy.',
            ])
          ]),
          new PartOfSpeech('verb', [
            new Definition('decide upon the look and functioning of (a building, garment, or other object), typically by making a detailed drawing of it.', [
              'She designed a new logo for the company.',
              'The engineers are designing a new model of the car.',
            ])
          ])
        ]
      ),
       new Word(
        137,
        'distinctive',
        [
          new PartOfSpeech('adjective', [
            new Definition('characteristic of one person or thing, and so serving to distinguish it from others.', [
              'His distinctive style of writing sets him apart from other authors.',
              'The restaurant is known for its distinctive flavors and presentation.',
            ]),
            new Definition('having a special quality, style, attractiveness, etc.', [
              'The singer’s distinctive voice made her instantly recognizable.',
              'The building has a distinctive design that makes it stand out.',
            ])
          ])
        ]
      ),
      new Word(
        138,
        'dynamic',
        [
          new PartOfSpeech('adjective', [
            new Definition('characterized by constant change, activity, or progress.', [
              'The technology industry is highly dynamic and rapidly evolving.',
              'She has a dynamic personality that energizes the team.',
            ]),
            new Definition('(of a person) positive in attitude and full of energy and new ideas.', [
              'He is a dynamic leader who inspires his employees.',
              'The company hired a dynamic manager to drive innovation.',
            ])
          ])
        ]
      ),
       new Word(
        139,
        'drive',
        [
          new PartOfSpeech('verb', [
            new Definition('operate and control the direction and speed of a motor vehicle.', [
              'She learned how to drive when she was sixteen.',
              'He drove to work every morning.',
            ]),
            new Definition('propel or carry along by force in a specified direction.', [
              'The wind drives the waves toward the shore.',
              'He was driven by his ambition to succeed.',
            ])
          ]),
          new PartOfSpeech('noun', [
            new Definition('an innate, biologically determined urge to attain a goal or satisfy a need.', [
              'She has a strong drive to succeed in her career.',
              'His competitive drive pushes him to excel in sports.',
            ]),
            new Definition('a trip or journey in a car.', [
              'We went for a drive along the coast.',
              'The drive to the mountains was breathtaking.',
            ])
          ])
        ]
      ),
    ]

this._words.next(words.map((word, index) => {
  word.id = index;
  return word;
}));

// Create a subset of the first 10 words
    const subsetWords = words.slice(0, 4);
    this._subsetWords.next(subsetWords);
}
  

  get words() {
    return this._words.asObservable();
  }

  get subsetWords() {
    return this._subsetWords.asObservable();
  }
 
}

 /* initialiseWordsB1(){
    const wordsB1: Word[]=[
      new Word(
          1,
  'measure',
  [
    new PartOfSpeech('noun', [
      new Definition('a plan or course of action taken to achieve a particular purpose.', [
        'New safety measures have been implemented at the factory.',
        'The government introduced several measures to boost the economy.'
      ]),
      new Definition('a standard unit used to express the size, amount, or degree of something.', [
        'A metre is a measure of length.',
        'The recipe calls for an exact measure of flour.'
      ])
    ]),
    new PartOfSpeech('verb', [
      new Definition('ascertain the size, amount, or degree of something.', [
        'The tailor measured the length of the fabric.',
        'They measured the temperature with a thermometer.'
      ])
    ])
  ],
  'determine size or take action',
  'B1'
),
new Word(
  3,
  'cause',
  [
    new PartOfSpeech('noun', [
      new Definition('a person or thing that gives rise to an action, phenomenon, or condition.', [
        'The heavy rain was the cause of the flooding.',
        'Smoking is a major cause of lung cancer.',
      ]),
      new Definition('a principle, aim, or movement to which one is committed and which one is prepared to defend or advocate.', [
        'She devoted her life to the cause of environmental protection.',
        'Many people donated money to the cause of fighting hunger.',
      ])
    ]),
    new PartOfSpeech('verb', [
      new Definition('make (something, typically something bad) happen.', [
        'The storm caused widespread damage.',
        'The delay caused her to miss the train.',
      ]),
      new Definition('make (someone) feel something, especially an emotion.', [
        'The news caused him great distress.',
        'Her actions caused a lot of trouble.',
      ])
    ])
  ],
  'reason for something happening',
  'B1',
),
   new Word(
  8,
  'combine',
  [
    new PartOfSpeech('verb', [
      new Definition('unite; merge.', [
        'The two companies combined to form a powerful new corporation.',
        'She combined all the ingredients in a large bowl.',
      ]),
      new Definition('join or bring together (two or more things) to form a whole.', [
        'The teacher combined theory with practice in the lessons.',
        'We need to combine our resources to solve the problem.',
      ])
    ]),
    new PartOfSpeech('noun', [
      new Definition('a group of people or companies acting together for a commercial purpose.', [
        'The farmers formed a combine to market their products.',
        'Several small firms joined forces to create a powerful combine in the industry.',
      ]),
      new Definition('a harvesting machine that cuts, threshes, and cleans grain while moving over a field.', [
        'The farmer used a combine to harvest the wheat field.',
        'Modern combines can harvest large fields in a short amount of time.',
      ])
    ])
  ],
  'bring together to form one',
  'B1'
),




    ]

  }

   initialiseWordsB2(){
    const wordsB1: Word[]=[
    new Word(
  4,
  'certify',
  [
    new PartOfSpeech('verb', [
      new Definition('attest or confirm in a formal statement.', [
        'The doctor certified that he was fully recovered.',
        'The accountant certified the financial statements as accurate.',
      ]),
      new Definition('officially recognize (someone or something) as possessing certain qualifications or meeting certain standards.', [
        'The agency certified the building as environmentally friendly.',
        'She is certified to teach in this state.',
      ]),
      new Definition('issue a certificate or license.', [
        'The authority certified the new pilot.',
        'The university certified her as having completed the course.',
      ])
    ])
  ],
  'formally confirm or authorize something',
  'B2'
),
new Word(
  5,
  'challenge',
  [
    new PartOfSpeech('noun', [
      new Definition('a call to take part in a contest or competition, especially a duel.', [
        'He accepted the challenge to compete in the marathon.',
        'The chess match posed a tough challenge for the young player.',
      ]),
      new Definition('a task or situation that tests someone\'s abilities.', [
        'Climbing Mount Everest was the biggest challenge of his life.',
        'The new project will be a real challenge for our team.',
      ]),
      new Definition('an objection or query as to the truth of something, often with an implicit demand for proof.', [
        'The scientist faced a challenge to his theory from a colleague.',
        'Her report was met with a challenge from the board members.',
      ])
    ]),
    new PartOfSpeech('verb', [
      new Definition('invite (someone) to engage in a contest.', [
        'He challenged his friend to a game of tennis.',
        'She challenged her rival to a debate on the issue.',
      ]),
      new Definition('dispute the truth or validity of.', [
        'They challenged the results of the election.',
        'The lawyer challenged the witness’s credibility in court.',
      ]),
      new Definition('test the abilities of (someone), especially in a demanding but stimulating undertaking.', [
        'The course is designed to challenge students at all levels.',
        'This puzzle really challenges your thinking skills.',
      ])
    ])
  ],
  'task or action testing abilities',
  'B2'
),
 
 new Word(
  6,
  'circumstance',
  [
    new PartOfSpeech('noun', [
      new Definition('a fact or condition connected with or relevant to an event or action.', [
        'She was a victim of circumstance, unable to escape the situation.',
        'The circumstances of his arrest were quite unusual.',
      ]),
      new Definition('one\'s state of financial or material welfare.', [
        'They were living in reduced circumstances after the financial crisis.',
        'Her circumstances improved after she got a new job.',
      ]),
      new Definition('an event or fact that causes or helps to cause something to happen, typically something undesirable.', [
        'The sudden illness was an unfortunate circumstance.',
        'Due to unforeseen circumstances, the meeting was postponed.',
      ])
    ])
  ],
  'a situation or surrounding condition',
  'B2'
),
 new Word(
  7,
  'classify',
  [
    new PartOfSpeech('verb', [
      new Definition('arrange (a group of people or things) in classes or categories according to shared qualities or characteristics.', [
        'The books in the library are classified by subject.',
        'Scientists classify animals and plants into different groups.',
      ]),
      new Definition('designate (documents or information) as officially secret.', [
        'The government classified the documents to protect national security.',
        'Certain information about the mission was classified.',
      ])
    ])
  ],
  'sort into categories or groups',
  'B2'
),
 new Word(
  13,
  'fragrance',
  [
    new PartOfSpeech('noun', [
      new Definition('a pleasant, sweet smell.', [
        'The fragrance of the flowers filled the room.',
        'She wore a fragrance that was light and refreshing.',
      ]),
      new Definition('a perfume or aftershave.', [
        'He bought her a new fragrance for her birthday.',
        'The store carries a wide variety of fragrances for both men and women.',
      ])
    ])
  ],
  'a pleasant or sweet smell',
  'B2'
),






    ]
  }
  initialiseWordsC1(){
    const wordsB1: Word[]=[
      new Word(
  2,
  'ingenious',
  [
    new PartOfSpeech('adjective', [
      new Definition('clever, original, and inventive.', [
        'He was an ingenious engineer who devised a system for recycling waste water.',
        'The ingenious design of the machine allowed it to operate with minimal energy.',
      ]),
      new Definition('(of a machine or idea) cleverly and originally devised and well suited to its purpose.', [
        'The ingenious device saved the company thousands of pounds.',
        'She came up with an ingenious solution to the problem.',
      ])
    ])
  ],
  'clever and creatively intelligent',
  'C1'
),
 new Word(
  11,
  'mastermind',
  [
    new PartOfSpeech('noun', [
      new Definition('a person with an outstanding intellect or who plans and directs a complex project or activity.', [
        'The mastermind behind the bank robbery was eventually caught by the police.',
        'She is considered the mastermind of the company’s latest marketing strategy.',
      ]),
      new Definition('a person who supplies the intelligence and ideas for an enterprise.', [
        'He was the mastermind who organized the entire event.',
        'The operation was executed flawlessly, thanks to the mastermind’s careful planning.',
      ])
    ]),
    new PartOfSpeech('verb', [
      new Definition('plan and direct (a complex undertaking, especially a crime).', [
        'The crime was masterminded by a group of professionals.',
        'She masterminded the campaign that led to their victory.',
      ])
    ])
  ],
  'person who plans something complex',
  'C1'
),
new Word(
  10,
  'majestic',
  [
    new PartOfSpeech('adjective', [
      new Definition('having or showing impressive beauty or dignity.', [
        'The majestic mountains rose high above the valley, their peaks covered in snow.',
        'The orchestra played a majestic symphony that captivated the audience.',
      ]),
      new Definition('grand and noble in appearance or behavior.', [
        'The lion, with its majestic mane, is often considered the king of the jungle.',
        'She walked into the room with a majestic grace that commanded everyone’s attention.',
      ])
    ])
  ],
  'grand, impressive, or dignified appearance',
  'C1'
),
 new Word(
  12,
  'momentous',
  [
    new PartOfSpeech('adjective', [
      new Definition('of great importance or significance, especially in having a bearing on future events.', [
        'The signing of the peace treaty was a momentous occasion in the country’s history.',
        'The decision to pursue this career path was momentous for her future.',
      ]),
      new Definition('having a great or lasting impact.', [
        'The discovery of penicillin was a momentous achievement in medical history.',
        'The speech was a momentous event that inspired a generation.',
      ])
    ])
  ],
  'extremely important or historically significant',
  'C1'
),



    ]
  }

  initialiseWordsC2(){
    const wordsB1: Word[]=[
      new Word(
  159,
  'jeopardize',
  [
    new PartOfSpeech('verb', [
      new Definition('put (someone or something) into a situation in which there is a danger of loss, harm, or failure.', [
        'His actions could jeopardize the entire project.',
        'You don’t want to jeopardize your future by making a bad decision.',
      ])
    ])
  ],
  'put someone or something at risk',
  'C2'
),
 new Word(
  9,
  'magnanimous',
  [
    new PartOfSpeech('adjective', [
      new Definition('generous or forgiving, especially toward a rival or less powerful person.', [
        'Despite losing the match, he was magnanimous in his defeat and congratulated the winner.',
        'She was magnanimous in victory, offering to share the prize with her opponent.',
      ]),
      new Definition('showing or suggesting a lofty and courageous spirit.', [
        'The magnanimous gesture of donating all the prize money to charity was widely praised.',
        'His magnanimous actions earned him the respect of his peers.',
      ]),
      new Definition('showing or suggesting nobility of feeling and generosity of mind.', [
        'The leader’s magnanimous speech focused on reconciliation and unity.',
        'Her magnanimous attitude in the face of criticism set an example for others.',
      ])
    ])
  ],
  'generous or noble in character',
  'C2'
),

    ]
  }
}*/
