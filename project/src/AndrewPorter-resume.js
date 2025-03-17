
const nodeOf = type => $("<" + type + ">");
const appendTo = (child, parent) => parent[0].appendChild(child[0]);

// Personal Information for injection
const personalInfo = {
  name: "Andrew Porter",
  title: "Software Engineer",
  tagline: "A passion for all things computing, all the time.",
  envelope: "SwissArmyBud@gmail.com", // Short-circuit FA-Icon for *EMAIL* key
  linkedin: "linkedin.com/SwissArmyBud",
  github: "github.com/SwissArmyBud"
};

// *********************** NAME BLOCKS ***********************
// List of name/title/tag blocks
const nameBlocks = [
  { type: "h3", class: "no-bm", id: "name" },
  { type: "h5", class: "no-bm tx-green", id: "title" },
  { type: "p", class: "b no-bm", id: "tagline" }
];
// Get DOM node from block
const getNameNode = (block) => nodeOf(block.type)
                              .addClass(block.class)
                              .text(personalInfo[block.id]);

// Get base div and append created nodes
const nameBlock = nodeOf("div")
                 .attr("id", "nameBlock")
                 .addClass("six columns");
nameBlocks.map(getNameNode)
          // Direct append until microCash fixed
          .map(node => appendTo(node, nameBlock));


// *********************** CONTACT BLOCKS ***********************
// List of contact areas, linked to PI keys above
const contactBlocks = [
  "envelope",
  "linkedin",
  "github"
];
// Get DOM node from string
const getContactNode = (field) => {
  let headline = nodeOf("h5")
                 .addClass("no-bm d-ibl v-align")
                 .text(personalInfo[field]);
  let icon = nodeOf("div").addClass("fa d-ibl v-align " + field);
  let node = nodeOf("div");
  // Direct append until microCash fixed
  appendTo(headline, node);
  appendTo(icon, node);
  return node;
};
// Get base div and append created nodes
const contactBlock = nodeOf("div")
                    .attr("id", "contactBlock")
                    .addClass("five columns");
contactBlocks.map(getContactNode)
             // Direct append until microCash fixed
             .map(node => appendTo(node, contactBlock));

// *********************** EDUCATION BLOCK ***********************
const educationBlocks = [
  {
    type: "h5",
    class: "no-bm",
    html: "CSU Monterey Bay, 2017"
  },
  {
    type: "p",
    class: "b tx-green",
    html: "Bachelor's Degree in Computer Science, <i>with distinction</i>"
  },
  {
    type: "ul",
    class: "slim-bm",
    list: {
      class:"tiny-bm",
      items:[
        "Double Specialization: <i>Networking & Security</i> and <i>Data Science</i>",
        "ETS Major Field Test - 93<sup>rd</sup> percentile versus national scores",
        "President, Association of Computing Machinery campus chapter",
      ]
    }
  }
];
// Get DOM node from field
const getEducationNode = (field) => {
  let edNode = nodeOf(field.type).addClass(field.class);
  // Fill node
  if(field.type != "ul"){
    // Simple HTML
    edNode.html(field.html);
  } else {
    // Unordered List
    field.list.items.map( html => nodeOf("li")
                                 .html(html)
                                 .addClass(field.list.class) )
                    .map( node => appendTo(node, edNode));
  }
  return edNode;
};
const educationBlock = nodeOf("div")
                      .attr("id", "educationBlock")
                      .addClass("eleven columns");
educationBlocks.map(getEducationNode)
               .map(node => appendTo(node, educationBlock));


// *********************** EXPERIENCE BLOCK ***********************
const experienceInfo = [
  // {
  //   company: "Enterprise Holdings",
  //   title: "Senior Customer Service Rep",
  //   dates: "2013 - 2017",
  //   duties: [
  //     "Key holder, supervised 5 employees and inventory worth $15 million",
  //   ],
  //   positions: [ ]
  // },
  {
    company: "MBay Systems",
    title: "Platform Engineer - June 2021",
    dates: "2017 - 2021",
    duties: [
      "Leverage DevOps to provide cloud-native Platform-as-a-Service",
    ],
    positions: [
      {
        name: "Software Engineer - October 2017",
        duties: [
          "Responsible for implementing and customizing software solutions",
        ]
      },
      {
        name: "Embedded Systems Engineer - January 2017",
        duties: [
          "Responsible for establishing \"first-light\" on new embedded systems",
          "Built hardware prototypes, wrote firmware, and designed final PCBs",
          // "Production hardened platforms for deployments to Edge networks",
        ]
      },
    ]
  },
  {
    company: "Capital Insurance Group",
    title: "Senior Software Engineer, Billing & Payments - March 2021",
    dates: "2020 - 2022",
    duties: [
      "Develop functionality and fix bugs in Guidewire InsuranceSuite",
      "Responsible for $500MM of incoming, $100MM of outgoing payments",
      "Create or improve DevOps approaches for all of CIG's applications",
      "Onboard, mentor, crosstrain both new hires and current engineers"
    ],
    positions: [
      {
        name: "Team Lead, Billing & Payments Production Support - Nov 2020",
        duties: [
          "Led team of 6 through bug triage, patch, test, and deployment of fixes",
          "Direct responsibility for Billing Center and Internal Payment Solutions"
        ]
      },
      {
        name: "Software Engineer, Billing & Payments - March 2020",
        duties: [
          "Implemented D.O.I. compliant COVID relief in Guidewire Billing Center",
          // "Also performed feature development on Policy Center and Legacy apps"
        ]
      },
    ]
  },
  {
    company: "Autodesk",
    title: "Senior Software Engineer, Platform Services - September 2022",
    dates: "2022 - current",
    duties: [
      "Tech Lead on greenfield highly-customized Backstage implementation, for an Internal Developer Portal with 5000+ users across the company",
      "Internship mentor and cross-trained internal IDP contributor teams",
      "Owned & maintained high volume Tier-2 API in Autodesk Platform Services at \"four nines\" across 3 commercial geo-regions plus FedRAMP",
      "Contributed to Developer Enablement tooling & systems across APS"
    ],
    positions: [ ]
  }
];
const getExperienceNode = (field) => {
  let elTemp;

  // Container node
  let node = nodeOf("row");

  // Header blob
  let blob = nodeOf("div").addClass("one columns");
  elTemp = nodeOf("div").addClass("blob bg-gray");
  appendTo(elTemp, blob);
  appendTo(blob, node);

  // Create text element
  let text = nodeOf("div").addClass("eleven columns");
  // Add text header
  elTemp = nodeOf("h5").addClass("no-bm")
                       .text(field.company + ", " + field.dates);
  appendTo(elTemp, text);
  elTemp = nodeOf("p").addClass("b tx-green")
                      .text(field.title);
  appendTo(elTemp, text);
  appendTo(text, node);
  // Start ul element
  let ul = nodeOf("ul").addClass("slim-bm");
  // Map all top-level duties into list
  field.duties.map( d => nodeOf('li').text(d).addClass("tiny-bm") )
              .map(n => appendTo(n, ul));
  // Push positions into list with headers
  field.positions.map( (p) => {
    // Create positions header and map
    elTemp = nodeOf("p").text(p.name).addClass("slim-tm b");
    appendTo(elTemp, ul);
    p.duties.map(d => nodeOf("li").text(d).addClass("tiny-bm"))
            .map(n => appendTo(n, ul));
  });
  appendTo(ul, text);
  return node;
};
let experienceBlock;
let mapExperienceFields = (selector) => {
  let sibling = $(selector);
  experienceInfo
    .map(getExperienceNode)
    .map( n => sibling[0].after(n[0]) );
};


// *********************** SKILLS BLOCK ***********************
const skillsInfo = [
  {
    title: "SOFT SKILLS",
    class: "skills",
    list: {
      class: "",
      items: [
        "Internally motivated to perform at a high level",
        "Quick learner and enjoy designing usable solutions",
        "Willingness to accept both criticism and help",
        "Effective and consistent communication across teams",
        "Capable of technical writing for variety of audiences"
      ]
    }
  },
  {
    title: "HARD SKILLS",
    class: "skills",
    list: {
      class: "",
      items: [
        "Capable of quickly becoming productive in new languages, frameworks, and environments",
        "Focus on enabling continuous integration for low-friction build/test/deploy workflows",
        "Ability to navigate and debug large code bases effectively, using basic tools and methods",
        "Strong high-level understanding of networks and networking technology/topology/protocols",
        "History of performing strongly when a member of a team or when serving in a leadership role",
        "Good experience virtualizing resources and utilizing cloud services/providers for solutions",
        "Leveraging DevOps to reduce team bandwidth requirements for the build/test/deploy chain",
        "Software/application engineering to support \"smart\" conversions of hardware/devices",
        "Hardware design and engineering, including basic PCB design and manufacturing"
      ]
    }
  },
  {
    title: "LANGUAGES & PLATFORMS",
    class: "solos",
    list: {
      class: "bg-green",
      items: [
        "JavaScript/NodeJS",
        "C/C++",
        "C#/.NET",
        "Java/Springboot",
        "Angular/React",
        "Golang",
        "SQL/noSQL",
        "DevOps",
        "Jenkins",
        "Docker",
        "Kubernetes",
        "Terraform",
        "Ansible",
        "Backstage",
        "BASH/PowerShell",
        "Git/Github",
        "Win/Linux",
        "AWS/Azure",
        "DigitalOcean",
        "Cloudflare"
      ]
    }
  },
  {
    title: "REFERENCES",
    class: "",
    list: {
      class: "",
      items: [
        "Personal and professional references available.",
        "Phone numbers & email addresses by request."
      ]
    }
  }
];

const getNodeFromSkill = (skill) => {
  let node = nodeOf("div");
  let head = nodeOf("h5").addClass("no-bm ul-green").text(skill.title);
  let list = nodeOf("ul").addClass("slim-bm " + skill.class);
  skill.list.items.map( text => nodeOf("li")
                               .addClass("tiny-bm " + skill.list.class)
                               .text(text))
                  .map( n => appendTo(n, list) );
  appendTo(head, node);
  appendTo(list, node);
  return node;
};
const skillBlocks = skillsInfo.map(getNodeFromSkill);

$(function(){

  // Direct append until microCash fixed
  let piBlock = $("#personalInfo");
  appendTo(nameBlock, piBlock);
  appendTo(contactBlock, piBlock);

  mapExperienceFields("#experienceInfoSibling");

  let edBlock = $("#educationInfo");
  appendTo(educationBlock, edBlock);

  let skillBlock = $("#skillsInfo");
  skillBlocks.map(n => appendTo(n, skillBlock) );

});
