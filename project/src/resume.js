
const nodeOf = type => $("<" + type + ">");
const appendTo = (child, parent) => parent[0].appendChild(child[0]);

// Personal Information for injection
const personalInfo = {
  name: "Andrew Porter",
  title: "Computer Scientist",
  tagline: "A passion for all things computing, all the time.",
  envelope: "swissarmybud@gmail.com", // Short-circuit FA-Icon for *EMAIL* key
  phone: "831-224-8051",
  github: "github.com/swissarmybud"
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
  "phone",
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
  {
    company: "Enterprise Holdings",
    title: "Senior Customer Service Rep",
    dates: "2013 - 2017",
    duties: [
      "Key holder, supervised 5 employees and inventory worth $15 million",
    ],
    projects: [

    ]
  },
  {
    company: "MBay Systems",
    title: "Computer Systems Engineer, Full Stack",
    dates: "2017 - 2020",
    duties: [
    ],
    projects: [
      {
        name: "Clients: Amagine Lighting & BioFresh",
        duties: [
          "Built hardware prototypes, wrote firmware, and designed final PCB",
          "Delivered integrated mobile app for unit control over Bluetooth",
          "Created system capable of identifying and harvesting field produce",
          "Designed multi-camera unit, integrated with custom HTML/JS frontend",
        ]
      },
      {
        name: "Internal",
        duties: [
          "Developed systems to enable BlockChain-as-a-Service",
          "Provided services integration of BCaaS business use-cases",
        ]
      },
    ]
  },
  {
    company: "CIG Insurance",
    title: "Senior Software Engineer, Billing & Payments",
    dates: "2020 - current",
    duties: [
      "Develop functionality and fix bugs in Guidewire InsuranceSuite",
      "Maintain and support legacy applications and integrations",
      "Onboard/mentor/train new hires and other lower level employees"
    ],
    projects: [
      {
        name: "Guidewire Billing Center, Primary Responsibility",
        duties: [
          "Implemented COVID relief as well as several critical business features",
          "Lead Engineer during Billing Center upgrade from v8 to v10"
        ]
      },
      {
        name: "Production Support, Team Lead",
        duties: [
          "Led team of 6 through bug triage, patch, test, and deployment of fixes"
        ]
      },
      {
        name: "Automate Internal Software Delivery",
        duties: [
          "Train department on and promote use of CI/CD development methods",
          "Use CI/CD tools and custom services to support no-touch deployment"
        ]
      },
    ]
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
  // Push projects into list with headers
  field.projects.map( (p) => {
    // Create project header and map
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
  experienceInfo.reverse()
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
        "Effective and consistent communication across team",
        "Integrate well with a variety of personality types",
        "Quick learner and enjoy designing usable solutions",
        "Internally motivated to perform at a high level",
        "Capable of technical writing for variety of audiences",
        "Willingness to accept both criticism and help"
      ]
    }
  },
  {
    title: "HARD SKILLS",
    class: "skills",
    list: {
      class: "",
      items: [
        "Capable of becoming productive in new languages/frameworks/environments quickly",
        "Focus on enabling process automation and continuous integration/build/test/deploy methodology",
        "Ability to navigate and debug large code bases effectively, using basic tools and methods",
        "Strong high-level understanding of networks and networking technology/topology/protocols",
        "Good experience virtualizing resources and utilizing cloud services/providers for solutions",
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
        "JavaScript/Node",
        "C/C++",
        "C#/.NET",
        "Java/Android",
        "Angular/React",
        "Golang",
        "SQL/noSQL",
        "Docker",
        "Jenkins",
        "Kubernetes",
        "BASH/PowerShell",
        "Git/Github",
        "Win/Linux"
      ]
    }
  },
  {
    title: "HOBBIES",
    class: "solos outters",
    list: {
      class: "tx-green",
      items: [
        "Triathlons",
        "Cooking",
        "Sailing",
        "Beekeeping",
        "Gardening",
        "Video Games",
        "Woodworking"
      ]
    }
  },
  {
    title: "REFERENCES",
    class: "",
    list: {
      class: "",
      items: [
        "Personal and professional references available",
        "Phone numbers & email addresses by request"
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

  let edBlock = $("#educationInfo");
  appendTo(educationBlock, edBlock);

  mapExperienceFields("#experienceInfoSibling");

  let skillBlock = $("#skillsInfo");
  skillBlocks.map(n => appendTo(n, skillBlock) );

});
