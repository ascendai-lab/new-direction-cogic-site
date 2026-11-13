// Loads the site's starting content into Sanity. Run once: node scripts/seed.mjs
// WARNING: re-running overwrites anything edited in the Studio since.
import { createReadStream } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { createClient } from '@sanity/client'

process.loadEnvFile('.env')
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const image = async (file) => {
  const asset = await client.assets.upload('image', createReadStream(`public/img/${file}`), { filename: file })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}
const keyed = (items) => items.map((i) => (typeof i === 'object' ? { _key: randomUUID().slice(0, 12), ...i } : i))
const cta = (label, href) => ({ _type: 'ctaButton', label, href, variant: 'primary' })
const META_TITLES = {
  visit: 'Plan your visit: Sunday worship in Vineland, NJ',
  'bible-study': 'Online Bible Study on Zoom, Wednesdays at 7 PM',
  'prayer-line': 'Prayer Line, Thursdays at 8 PM',
  about: 'About our church in Vineland, NJ',
  pastor: 'Elder Dr. Paul S. Harden, Sr., Pastor',
  give: 'Give online',
  contact: 'Contact us',
}
const page = (slug, title, hero, sections, description) => ({
  _id: `page-${slug}`,
  _type: 'page',
  title,
  slug: { _type: 'slug', current: slug },
  ...hero,
  sections: keyed(sections),
  seo: { _type: 'seoFields', metaTitle: META_TITLES[slug], metaDescription: description },
})

const ZOOM = 'https://zoom.us/j/8372535548'
const GIVE = 'https://www.zeffy.com/en-US/donation-form/donate-to-help-launch-our-church'
const VENUE = 'Ramada by Wyndham, Omni Ballroom'
const ADDRESS = '2216 W. Landis Avenue, Vineland, NJ 08360'
const MAPS = `https://www.google.com/maps?q=${encodeURIComponent(`${VENUE} ${ADDRESS}`)}`

const [logo, hero, pastor] = await Promise.all([image('logo.png'), image('hero-community.jpg'), image('pastor-solid-blue.png')])

const creed = { _type: 'creedBlock', heading: 'Affirmation of Faith', tone: 'cream', anchor: 'beliefs' }
const foundation = { _type: 'verseBlock', quote: 'Not that we are sufficient of ourselves… but our sufficiency is of God.', cite: '2 Corinthians 3:5', tone: 'white' }

const docs = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'New Direction C.O.G.I.C',
    tagline: 'Come, Worship, and Grow with Us',
    email: 'thenewdirectioncogic@gmail.com',
    address: ADDRESS,
    googleAnalyticsId: 'G-Q1BGD7M98D',
    facebook: 'https://www.facebook.com/thenewdirectioncogic',
    instagram: 'https://www.instagram.com/thenewdirectioncogic/',
    youtube: 'https://www.youtube.com/@thenewdirectioncogic',
    locationName: VENUE,
    directions: 'Take Route 55 to Exit 32A. We meet in the Omni Ballroom at the Ramada, on the left side of the hotel behind IHOP.',
    donateUrl: GIVE,
    footerTagline: 'Whatever brought you here, you are welcome exactly as you are.',
    copyrightName: 'New Direction C.O.G.I.C',
    defaultSeo: { _type: 'seoFields', metaDescription: 'New Direction C.O.G.I.C is a contemporary Church of God in Christ congregation in Vineland, NJ, gathering for Sunday worship, Bible study and prayer.' },
    gatherings: keyed([
      {
        key: 'sundaySchool', name: 'Sunday School (All Ages)', timeLabel: 'Sundays at 10:00 AM', nextLabel: 'Next class',
        weekday: 0, startTime: '10:00', durationMinutes: 60,
      },
      {
        key: 'sunday', name: 'Sunday Worship', timeLabel: 'Sundays at 11:00 AM', nextLabel: 'Next service',
        weekday: 0, startTime: '11:00', durationMinutes: 90,
        rows: keyed([
          { label: 'Sunday School', value: '10:00 AM' },
          { label: 'Morning Worship', value: '11:00 AM' },
          { label: 'Where', value: VENUE },
          { label: 'Address', value: ADDRESS, href: MAPS },
          { label: 'Who', value: 'Everyone' },
        ]),
        action: cta('Plan your visit', '/visit'),
        calendarDetails: `Sunday School at 10:00 AM, Morning Worship at 11:00 AM. ${VENUE}, ${ADDRESS}. Everyone is welcome.`,
      },
      {
        key: 'bibleStudy', name: 'Online Bible Study', timeLabel: 'Wednesdays at 7:00 PM', nextLabel: 'Next session',
        weekday: 3, startTime: '19:00', durationMinutes: 60,
        rows: keyed([
          { label: 'When', value: 'Wednesdays, 7:00 PM ET' },
          { label: 'Where', value: 'Online on Zoom' },
          { label: 'Meeting ID', value: '837 253 5548', copy: '8372535548' },
          { label: 'How long', value: 'About an hour' },
          { label: 'Facilitator', value: 'Elder Paul S. Harden, Sr.' },
          { label: 'Who', value: 'Everyone' },
        ]),
        action: cta('Join Bible Study', ZOOM),
        calendarDetails: `Weekly online Bible Study. Everyone is welcome. ${ZOOM}`,
      },
      {
        key: 'prayerLine', name: 'Prayer Line', timeLabel: 'Thursdays at 8:00 PM', nextLabel: 'Next prayer line',
        weekday: 4, startTime: '20:00', durationMinutes: 60,
        rows: keyed([
          { label: 'When', value: 'Thursdays, 8:00 PM ET' },
          { label: 'Dial', value: '(605) 313-9874', href: 'tel:+16053139874' },
          { label: 'Access code', value: '1636586', copy: '1636586' },
          { label: 'Who', value: 'All are welcome' },
        ]),
        action: cta('Call now', 'tel:+16053139874'),
        calendarDetails: 'Dial (605) 313-9874, access code 1636586. All are welcome.',
      },
    ]),
    pastorName: 'Elder Dr. Paul S. Harden, Sr.',
    pastorPhoto: pastor,
    pastorSummary: 'Elder Harden has a passion for seeing people reach their fullest potential, spiritually and naturally. He was ordained Elder in 2005 and previously served as Administrative Assistant at Miracle Temple Church of God in Christ.',
    pastorBio: `Elder Dr. Paul S. Harden, Sr. previously served as the Administrative Assistant at Miracle Temple Church of God in Christ. He graduated from the University of the Sciences in Philadelphia with a Doctor of Pharmacy degree. It was during his years at the university that he felt his call to the ministry through a God given vision.

In May of 2001, he was locally ordained as “Minister” by Reverend Emily Myrick, Pastor of Miracle Temple Church of God in Christ. In October 2005, he further fulfilled his call to the ministry and was ordained “Elder” by Bishop Ernest C. Morris, Prelate of the Koinonia Jurisdiction COGIC. Elder Harden serves on the Board of Trustees, and is co-coordinator of the Men’s Department. He previously served as Youth Pastor of Miracle Temple and as Auxiliaries In Ministry (AIM) Chairman in the Koinonia Jurisdiction COGIC.

He is married to Sister Kedra Harden and together they have two daughters, Dajanae and Emily (Maya), and two sons, Paul Jr. and Malachi. Elder Harden has a passion for seeing people reach their fullest potential both spiritually and naturally, while keeping in mind:`,
    pastorVerse: 'Not that we are sufficient of ourselves to think anything as of ourselves; but our sufficiency is of God.',
    pastorVerseCite: '2 Corinthians 3:5',
    pastorClosing: 'In other words, without God we can do nothing.',
    affirmation: [
      'We believe the Bible to be the inspired and only infallible Word of God.',
      'We believe that there is One God, eternally existent in Three Persons: God the Father, God the Son and God the Holy Ghost.',
      'We believe in the Blessed Hope, which is the rapture of the Church of God, which is in Christ, at His return.',
      'We believe that the only means of being cleansed from sin is through repentance: faith in the precious Blood of Jesus Christ and being baptized.',
      'We believe that regeneration by the Holy Ghost is absolutely essential for personal salvation.',
      'We believe that the redemptive work of Christ on the cross provides healing for the human body in answer to believing in prayer.',
      'We believe that the baptism in the Holy Ghost, according to Acts 2:4 is given to believers who ask for it.',
      'We believe in the sanctifying power of the Holy Spirit, by Whose indwelling, the Christian is enabled to live a holy and separated life in this present world.',
    ],
  },
  {
    _id: 'navConfig',
    _type: 'navConfig',
    logo,
    logoAlt: 'New Direction C.O.G.I.C',
    links: keyed([
      { label: 'Plan your visit', href: '/visit' },
      { label: 'Bible Study', href: '/bible-study' },
      { label: 'Prayer Line', href: '/prayer-line' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ]),
    ctaButton: cta('Give', '/give'),
    secondaryButton: cta('Get updates', '/#updates'),
    mobileButton: cta('Join Bible Study', ZOOM),
  },
  {
    _id: 'homePage',
    _type: 'homePage',
    heroKicker: 'Sundays in person, Wednesdays on Zoom, Thursdays on the prayer line. There is a place for you at New Direction.',
    heroHeadline: 'More than a service, it’s a *family.*',
    heroImage: hero,
    heroImageAlt: 'People smiling and clapping together at a community gathering',
    heroCta: cta('Donate Now', GIVE),
    heroSecondaryCta: cta('Plan your visit', '/visit'),
    ribbon: ['Sunday Worship', 'Sundays at 11:00 AM', '*Everyone is welcome*', 'Contemporary worship', 'Church of God in Christ roots'],
    sections: keyed([
      {
        _type: 'textBlock', tone: 'white', anchor: 'story',
        heading: 'Come once, and you will not feel *new* for long.',
        body: 'We are a new church, now worshiping in person every Sunday in Vineland. No crowd to get lost in, nothing to sign. What there is: contemporary worship with Church of God in Christ roots, a group that is still small enough to know your name, and a pastor who will learn it.',
        textLink: cta('Plan your visit', '/visit'),
      },
      {
        _type: 'cardGrid', tone: 'tint', numbered: true,
        heading: 'Three ways to gather *this week*',
        cards: keyed([
          { title: 'Sunday in person', text: 'Sunday School at 10:00 AM and Morning Worship at 11:00 AM at the Ramada in Vineland, NJ.', link: cta('Plan your visit', '/visit') },
          { title: 'Wednesday on Zoom', text: 'Online Bible Study at 7:00 PM. Practical teaching, discussion and room for your questions.', link: cta('Join Bible Study', '/bible-study') },
          { title: 'Thursday by phone', text: 'Prayer Line at 8:00 PM. Call in from anywhere and pray with us.', link: cta('Get the number', '/prayer-line') },
        ]),
      },
      {
        _type: 'gatheringBand', gatheringKey: 'sunday', anchor: 'sunday',
        heading: 'Worship with us, every *Sunday.*',
        body: 'Live and in person in Vineland. Open to everyone, whether you have been in church for thirty years or have never walked into one. Come as you are.',
      },
      { _type: 'pastorBlock', tone: 'white', anchor: 'pastor' },
      creed,
      foundation,
      {
        _type: 'formBlock', kind: 'updates', tone: 'sunken', anchor: 'updates',
        heading: 'Stay close to what comes *next.*',
        body: 'Leave your name and we will keep you up to date on services, Bible Study, prayer and how to get involved. No spam, and you can unsubscribe any time.',
      },
    ]),
    seo: { _type: 'seoFields', metaTitle: 'A church in Vineland, NJ', metaDescription: 'New Direction C.O.G.I.C is a contemporary church in Vineland, NJ. Worship with us in person on Sundays at 11:00 AM. Everyone is welcome.' },
  },

  page('visit', 'Plan your visit', {
    heroKicker: 'Come, worship, and grow with us',
    heroHeadline: 'You are welcome *exactly* as you are.',
    heroSubheadline: 'Here is everything you need for your first Sunday at New Direction.',
  }, [
    { _type: 'gatheringBand', gatheringKey: 'sunday', heading: 'Live and in *person.*', body: 'Sunday School starts at 10:00 AM and Morning Worship starts at 11:00 AM. Come for one or stay for both.' },
    {
      _type: 'cardGrid', tone: 'tint', numbered: true, heading: 'Your first *Sunday*',
      cards: keyed([
        { title: 'Find the ballroom', text: 'We meet in the Omni Ballroom at the Ramada by Wyndham, on the left side of the hotel behind IHOP.' },
        { title: 'Sunday School, 10:00 AM', text: 'Classes for every stage: Elementary, Secondary, College and Adult.' },
        { title: 'Morning Worship, 11:00 AM', text: 'Our worship is contemporary and our roots are in the Church of God in Christ. Both are true at the same time.' },
      ]),
    },
    { _type: 'mapBlock', heading: 'Find us in *Vineland*', tone: 'white', anchor: 'directions' },
    {
      _type: 'cardGrid', tone: 'sunken', numbered: false, heading: 'Not free on Sunday?',
      cards: keyed([
        { title: 'Online Bible Study', text: 'Wednesdays at 7:00 PM on Zoom.', link: cta('Join Bible Study', '/bible-study') },
        { title: 'Prayer Line', text: 'Thursdays at 8:00 PM by phone.', link: cta('Get the number', '/prayer-line') },
      ]),
    },
  ], 'Plan your visit to New Direction C.O.G.I.C. Sunday School at 10:00 AM and Morning Worship at 11:00 AM at the Ramada in Vineland, NJ.'),

  page('bible-study', 'Bible Study', {
    heroKicker: 'Grow in God’s Word, strengthen your faith, connect with others',
    heroHeadline: 'Online Bible Study, every *Wednesday.*',
    heroSubheadline: 'Join us each Wednesday as we study God’s Word together and strengthen our walk with Christ.',
  }, [
    { _type: 'gatheringBand', gatheringKey: 'bibleStudy', heading: 'Open your laptop and *join in.*', body: 'Open to everyone, whether you have read the Bible for thirty years or have never opened one. Come with a question. Leave with a few more.' },
    {
      _type: 'cardGrid', tone: 'tint', numbered: true, heading: 'What you will *find here*',
      cards: keyed([
        { title: 'Practical teaching', text: 'Bible teaching and discussion you can use.' },
        { title: 'Everyday encouragement', text: 'Encouragement for everyday living.' },
        { title: 'Prayer and support', text: 'Prayer and spiritual support from people who care.' },
        { title: 'Welcome at any age', text: 'A welcoming environment for all ages.' },
        { title: 'Room for questions', text: 'Opportunities to ask questions and grow in faith.' },
      ]),
    },
    { _type: 'verseBlock', quote: 'Your word is a lamp to my feet and a light to my path.', cite: 'Psalm 119:105', tone: 'white' },
    { _type: 'textBlock', tone: 'cream', heading: 'Study to show yourself *approved.*', body: '2 Timothy 2:15', button: cta('Join Bible Study', ZOOM) },
  ], 'Join New Direction C.O.G.I.C for Online Bible Study every Wednesday at 7:00 PM on Zoom, led by Elder Paul S. Harden, Sr. Everyone is welcome.'),

  page('prayer-line', 'Prayer Line', {
    heroKicker: 'Pray, believe, connect, receive',
    heroHeadline: 'Where prayer changes *things.*',
    heroSubheadline: 'Join us every Thursday evening as we come together in prayer, faith and unity.',
  }, [
    { _type: 'gatheringBand', gatheringKey: 'prayerLine', heading: 'Call in from *anywhere.*', body: 'All you need is a phone. Dial the number, enter the access code, and pray with us.' },
    {
      _type: 'cardGrid', tone: 'tint', numbered: false, heading: 'Is this *for you?*',
      cards: keyed([
        { title: 'Need encouragement?' },
        { title: 'Seeking God’s direction?' },
        { title: 'Believing for a breakthrough?' },
        { title: 'Standing in faith for yourself or a loved one?' },
      ]),
    },
    {
      _type: 'cardGrid', tone: 'cream', numbered: false, heading: 'What we are *believing for*',
      cards: keyed([
        { title: 'Inspiration' }, { title: 'Healing prayer' }, { title: 'Encouragement' }, { title: 'Spiritual growth' }, { title: 'A closer walk with God' },
      ]),
    },
    { _type: 'verseBlock', quote: 'The effectual fervent prayer of a righteous person availeth much.', cite: 'James 5:16', tone: 'white' },
    { _type: 'textBlock', tone: 'sunken', heading: 'Bring someone *with you.*', body: 'Invite your family, friends, neighbors and coworkers.' },
  ], 'Call the New Direction C.O.G.I.C Prayer Line every Thursday at 8:00 PM. Dial (605) 313-9874, access code 1636586. All are welcome.'),

  page('about', 'About', {
    heroKicker: 'People, purpose, progress, for His glory',
    heroHeadline: 'A new church with *deep roots.*',
    heroSubheadline: 'New Direction C.O.G.I.C is a contemporary church with Church of God in Christ roots.',
  }, [
    {
      _type: 'textBlock', tone: 'white',
      heading: 'Moving forward in *faith.*',
      body: 'Our goal is spiritual service and development, for each person individually and for the community together.\n\nWe started with a Bible study on Zoom, and today we worship in person every Sunday in Vineland, New Jersey. We are still small enough to know your name, and we are just getting started.',
      textLink: cta('Plan your visit', '/visit'),
    },
    {
      _type: 'cardGrid', tone: 'tint', numbered: true, heading: 'People, purpose, *progress*',
      cards: keyed([
        { title: 'People', text: 'Whatever brought you here, you are welcome exactly as you are.' },
        { title: 'Purpose', text: 'We want to see every person reach their fullest potential, spiritually and naturally.' },
        { title: 'Progress', text: 'We keep moving forward in faith, for His glory.' },
      ]),
    },
    creed,
    { _type: 'pastorBlock', tone: 'white' },
    foundation,
  ], 'New Direction C.O.G.I.C is a contemporary church with Church of God in Christ roots, serving Vineland, NJ through worship, study and service.'),

  page('pastor', 'Our pastor', {
    heroKicker: 'Our pastor',
    heroHeadline: 'Meet Elder *Harden.*',
  }, [
    { _type: 'pastorBlock', tone: 'white', showFullBio: true },
    { _type: 'textBlock', tone: 'sunken', heading: 'We would love to *meet you.*', button: cta('Plan your visit', '/visit') },
  ], 'Meet Elder Dr. Paul S. Harden, Sr., pastor of New Direction C.O.G.I.C in Vineland, NJ.'),

  page('give', 'Give', {
    heroKicker: 'Give',
    heroHeadline: 'Help us grow this *family.*',
    heroSubheadline: 'Your gift helps launch and grow New Direction C.O.G.I.C.',
  }, [
    {
      _type: 'textBlock', tone: 'tint', heading: 'Give *online*',
      body: 'We use Zeffy for online giving. Thank you for standing with us.',
      button: { ...cta('Give online', GIVE), openInNewTab: true },
    },
  ], 'Give online to support New Direction C.O.G.I.C, a growing church in Vineland, NJ. Your gift helps launch and grow our ministry.'),

  page('contact', 'Contact', {
    heroKicker: 'Contact',
    heroHeadline: 'We would love to hear *from you.*',
    heroSubheadline: 'Ask a question, tell us you are coming, or send us a prayer request.',
  }, [
    {
      _type: 'cardGrid', tone: 'tint', numbered: false, heading: 'Three ways to *connect*',
      cards: keyed([
        { title: 'Email us', text: 'thenewdirectioncogic@gmail.com', link: cta('Send an email', 'mailto:thenewdirectioncogic@gmail.com') },
        { title: 'Visit on Sunday', text: `${VENUE}, ${ADDRESS}`, link: cta('Plan your visit', '/visit') },
        { title: 'Call the prayer line', text: 'Thursdays at 8:00 PM. Dial (605) 313-9874, access code 1636586.', link: cta('Prayer Line details', '/prayer-line') },
      ]),
    },
    { _type: 'formBlock', kind: 'contact', tone: 'sunken', heading: 'How can we *help?*' },
  ], 'Contact New Direction C.O.G.I.C in Vineland, NJ with a question, a prayer request, or to plan your visit.'),
]

const tx = client.transaction()
docs.forEach((d) => tx.createOrReplace(d))
await tx.commit()
console.log(`Seeded ${docs.length} documents`)
