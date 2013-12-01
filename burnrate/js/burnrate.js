/**
 *
 * User: lin
 * Date: 13-11-28
 * Time: 下午10:34
 *
 */

var burnrate = window.burnrate = {
    type_card:    { employee: 'employee', skill:'skill'},
    title:        { Engineer: 'Engineer', Manager:'Manager', vp: 'Vice President',
                    Contractor: 'Contractor'},
    type_skill:   { department: 'department', title: 'title'},
    department:   { hr: 'human resource', sales:'sales', development: 'development',
                    finance: 'finance'},
    ability:      { _0: 0, _1: 1,_2: 2, _3: 3},
    burn:         { _1: 1, _2: 2, _3 : 3},
    project_level:{ _1: 1, _2: 2, _3 : 3, _4 : 4},
    money_funding:{ _5: 5, _10: 10, _15: 15, _20: 20},
    num_vp:       { _2: 2, m_3: 3},

    game: {},
    init: function(){
        initEmployees();
        initPlayers();
        initSkills();
    }
};

(function lang_zh(burnrate){
    _.extend(burnrate, {
        title_ZH_CN:        { Engineer: '工程师', Manager:'经理', vp: '副总裁', Contractor: '外包工程师'},
        department_ZH_CN:   { hr: '人力资源部', sales:'市场部', development: '研发部',finance: '融资部'},
        getTitle_ZH_CN: function (title){
            return burnrate.title_ZH_CN[title] || '';
        },
        getDepartment_ZH_CN: function (department){
            return burnrate.department_ZH_CN[title] || '';
        }
    })
})(burnrate);

function Game(){
    this.players = [];
    this.employeeCards = [];
    this.skillCards = [];
    this.addPlayer = function(player){
        this.players.push(player);
    }
}

function Player(id, name, money){
    this.id = id;
    this.name = name;
    this.money = money;
    this.projects = [];
    this.employees = [];
    this.firing = false;//firing doubles cost

    this.getDepartmentAbility = function (department){
        //default ability = zero;
        var ability = burnrate.ability[0];
        _.each(this.employees, function(){
            var employee = this;
            if(employee.department == department){
                //vp's ability = department's ability,ignore managers
                if(employee.title == burnrate.title[2]){
                    ability = employee.ability;
                }else{
                    ability = _.max(employee.ability, ability);
                }

            }
        });
        return ability;
    }

    this.employ = function(anEmployee){
        this.employees.push(anEmployee);
    }

    this.fire = function(anEmployee){
        this.employees = _.without(this.employees, anEmployee);
    }

    this.badIdea = function(project){
        this.projects.push(project);
    }

    this.release = function(project){
        this.projects = _.without(this.projects, project);
    }

}

function Employee(department, ability, title, burn){
    this.department = department;
    this.ability = ability;
    this.title = title;
    this.burn = burn;
    this.toString = function (){
        var string = [];
        string.push('department' + ':' + this.department);
        string.push('title' + ':' + this.title);
        string.push('ability' + ':' + this.ability);
        string.push('burn' + ':' + this.burn);
        return '[An Employee:{' + string + '}]';
    }
}

function SkillCard(name, description, type_skill, department, ability, skill){
    this.name = name;
    this.description = description;
    this.type_kill = type_skill;
    this.department = department;
    this.ability = ability;
    this.skill = skill;
}

function Project(project_level){
    this.project_level = project_level;
}

function SC_BadIdea(ability, level_bad){
    var card = new SkillCard('BAD IDEA', 'Bulter-Hosted \nSearch Portal');

}

function initEmployees(){
    var employees = burnrate.employees = {};
    //(vp + manager) in every department
    for(var i in burnrate.department){
        var c_e_d = employees[burnrate.department[i]] = [];
        console.log(burnrate.department[i])
        //vp br:2 + abi:3
        c_e_d.push(new Employee(burnrate.department[i],
            burnrate.ability._3, burnrate.title.vp,burnrate.burn[1]));
        //vp br:2 + abi:2
        c_e_d.push(new Employee(burnrate.department[i],
            burnrate.ability._2, burnrate.title.vp,burnrate.burn[1]));
        c_e_d.push(new Employee(burnrate.department[i],
            burnrate.ability._2, burnrate.title.vp,burnrate.burn[1]));
        //vp br:2 + abi:0
        c_e_d.push(new Employee(burnrate.department[i],
            burnrate.ability._0, burnrate.title.vp,burnrate.burn[1]));
        _.times(10,function(){
            //manager br:random[1, 2] + abi:random[1, 2]
            c_e_d.push(new Employee(burnrate.department[i],
                burnrate.ability[_.random(1,2)], burnrate.title.Manager,
                _.values(burnrate.burn)[_.random(0,1)]));
        });
    }

    //Engineer * 15, br:1 + abi:''
    _.times(15,function(){
        employees[burnrate.department.development].push(new Employee(burnrate.department[i],
            '', burnrate.title.Engineer, burnrate.burn._1));
    });

    //Contractor * 15, br:3 + abi:''
    _.times(15,function(){
        employees[burnrate.department.development].push(new Employee('',
            '', burnrate.title.Contractor, burnrate.burn._3));
    });
}

function initPlayers(){
    log('initPlayers');
}

function initSkills(){
    log('initSkills');
}

function Skill(name,  department, ability, affect){
    this.name = name;
    this.department = department;
    this.ability = ability;
    this.affect = affect;
    this.doAffect = function(){
        affect(arguments);
    }
}

//hr：网罗，雇错人，雇佣，解雇
//develop：终止
//finance: +5 +10 +15 +20
//market：馊主意
//other：大裁员，解甲归田

$(function(){
    burnrate.init();
    var $card_border = $(".card-border").remove();
    var colors = ['color-hr', 'color-sales', 'color-develop', 'color-finance', 'color-contractor'];
    var names = ['Bill Gates', 'Hans Weich', 'Brad Duke'];
    var employees = burnrate.employees;
    _.each(employees, function(employees_dep, department){
        var department_ZH_CN = burnrate.getDepartment_ZH_CN(department);
        var color = colors[_.indexOf(burnrate.department, department)];
        var title_vp = burnrate.title[2];
        var title_engineer = burnrate.title[0];
        var title_outsource = burnrate.title[3];
        _.each(employees_dep,function(employee){
            var ability = employee.ability;
            var title = employee.title;
            var title_ZH_CN = burnrate.getTitle_ZH_CN(title);
            var sign_vp = (title == title_vp) ? 'vp' : '';
            var burn_num =  employee.burn;
            var name_employee = names[_.random(names.length)];
            var $employeeCard = $card_border.clone()
                .find(".card").addClass(color).end()
                .find(".circle").addClass(color + '-light')
                    .addClass('border-' + color).html(ability).end()
                .find(".department-en").html(department).end() //.toLocaleUpperCase()
                .find(".department-zh").html(department_ZH_CN).end()
                .find(".vp").html(sign_vp).end()
                .find(".title-en").html(title).end()
                .find(".title-zh").html(title_ZH_CN).end()
                //.find(".pic").end()  TODO: change pic
                .find(".name-employee").html(name_employee).end()
                .find(".burn-num").html(burn_num).end();
            if(title == title_engineer){
                $employeeCard.find(".circle").hide();
            }else if(title == title_outsource){
                $employeeCard.find(".circle").hide();
                $employeeCard.find(".card").removeClass(color).addClass(colors[4]);
            }
            $(document.body).append($employeeCard);
        });
    });
    var skill = new Skill('Bad Idea', null, burnrate.department[0], burnrate.ability[2],
        function(targetPlayer){
            targetPlayer.badIdea(burnrate.project_level.level_2);
        }
    );
});

function log(){
    if(console && console.log){
        console.log(arguments);
    }
}