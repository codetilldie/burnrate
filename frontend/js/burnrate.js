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
    skill_type:   { department: 'department', title: 'title'},
    department:   { hr: 'human resource', sales:'sales', development: 'development',
                    finance: 'finance'},
    target_type:  {'self':'self', 'other one':'other one'},
    ability:      { _0: 0, _1: 1,_2: 2, _3: 3},
    burn:         { _1: 1, _2: 2, _3 : 3},
    project_level:{ _1: 1, _2: 2, _3 : 3, _4 : 4},
    money_funding:{ _5: 5, _10: 10, _15: 15, _20: 20},
    vp_num:       { _0: 0, _2: 2, _3: 3},

    game: {},
    init: function(){
        initEmployees();
        initPlayers();
        initSkills();
    }
};

/**
 * support zh_cn
 */
(function lang_zh(burnrate){
    _.extend(burnrate, {
        title_ZH_CN:        { Engineer: '工程师', Manager:'经理', vp: '副总裁', Contractor: '外包工程师'},
        department_ZH_CN:   { hr: '人力资源部', sales:'市场部', development: '研发部',finance: '融资部'},
        getTitle_ZH_CN: function (title){
            return burnrate.title_ZH_CN[getKey(burnrate.title, title)] || '';
        },
        getDepartment_ZH_CN: function (department){
            return burnrate.department_ZH_CN[getKey(burnrate.department, department)] || '';
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

function Project(project_level){
    this.project_level = project_level;
}

function Player(id, name, money){
    this.id = id;
    this.name = name;
    this.money = money;
    this.projects = [];
    this.employees = [];
    this.firing = false;//firing doubles cost

    //Todo: should not count every time, change to add/min it when employee/fire
    this.getDepartmentAbility = function (department){
        //default ability = zero;
        var ability = burnrate.ability._0;
        _.each(this.employees, function(){
            var employee = this;
            if(employee.department == department){
                //vp's ability = department's ability,ignore managers
                if(employee.title == burnrate.title.vp){
                    ability = employee.ability;
                }else{
                    ability = _.max(employee.ability, ability);
                }

            }
        });
        return ability;
    }

    this.getVPNum = function(){
        var vp_num = 0;
        _.each(this.employees, function(){
            var employee = this;
            if(employee.department == department){
                if(employee.title == burnrate.title.vp){
                    vp_num++;
                }
            }
        });
        return vp_num;
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

function initPlayers(){
    log('initPlayers');
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

function initEmployees(){
    var employees = burnrate.employees = {};
    //(vp + manager) in every department
    var abilities = [burnrate.ability._1, burnrate.ability._1, burnrate.ability._2];
    var burns = [burnrate.burn._1, burnrate.burn._1, burnrate.burn._2];
    for(var department in burnrate.department){
        var c_e_d = employees[burnrate.department[department]] = [];
        //vp br:2 + abi:3
        c_e_d.push(new Employee(burnrate.department[department],
            burnrate.ability._3, burnrate.title.vp,burnrate.burn._2));
        //vp br:2 + abi:2
        c_e_d.push(new Employee(burnrate.department[department],
            burnrate.ability._2, burnrate.title.vp,burnrate.burn._2));
        c_e_d.push(new Employee(burnrate.department[department],
            burnrate.ability._2, burnrate.title.vp,burnrate.burn._2));
        //vp br:2 + abi:0
        c_e_d.push(new Employee(burnrate.department[department],
            burnrate.ability._0, burnrate.title.vp,burnrate.burn._2));
        _.times(10,function(){
            //manager br:random[1, 2] + abi:random[1, 2]
            c_e_d.push(new Employee(burnrate.department[department],
                abilities[_.random(0,abilities.length)], burnrate.title.Manager,
                burns[_.random(0,burns.length)]));
        });
    }

    //Engineer * 15, br:1 + abi:''
    _.times(15,function(){
        employees[burnrate.department.development].push(new Employee(burnrate.department[department],
            '', burnrate.title.Engineer, burnrate.burn._1));
    });

    //Contractor * 15, br:3 + abi:''
    _.times(15,function(){
        employees[burnrate.department.development].push(new Employee('',
            '', burnrate.title.Contractor, burnrate.burn._3));
    });
}

function Skill(name,  department, ability, vp_num, skill_type, target_type, affect, note){
    this.name = name;
    this.department = department;
    this.ability = ability;
    this.vp_num = vp_num;
    this.affect = affect;
    this.note = note;
    this.skill_type = skill_type;
    this.target_type = target_type;
    this.doAffect = function(){
        affect(arguments);
    }
    //Todo:should change to a vari [condition]
    this.canAffect = function(self, target){
        target = (this.target_type == burnrate.target_type.self) ? self : target;
        if(target_type == burnrate.skill_type.department){
            return target.getDepartmentAbility(department) >= this.ability;
        }else{
            return target.getVPNum() >= this.vp_num;
        }
    }
}

function initSkills(){
    burnrate['affects'] = {
        'bad_idea': function(target){
            target.badIdea(burnrate.project_level.level_2);
        },
        'release': function(target){
            target.badIdea(burnrate.project_level.level_2);
        }
    }
    var skill = new Skill('Bad Idea', burnrate.department.sales, burnrate.ability._2,
        burnrate.vp_num._0, burnrate.skill_type.department, burnrate.target_type.other_one,
        burnrate.affects.bad_idea,'');
}

//hr：网罗，雇错人，雇佣，解雇
//develop：终止
//finance: +5 +10 +15 +20
//market：馊主意
//other：大裁员，解甲归田

$(function(){
    burnrate.init();
    var $card_border = $(".card-border").remove();
    var colors = {};
    colors[burnrate.department.development] = 'color-develop';
    colors[burnrate.department.hr] = 'color-hr';
    colors[burnrate.department.finance] = 'color-finance';
    colors[burnrate.department.sales] = 'color-sales';
    colors['contractor'] = 'color-contractor';
    var names = ['Bill Gates', 'Hans Weich', 'Brad Duke'];//Todo : more names
    var employees = burnrate.employees;
    _.each(employees, function(employees_dep, department){
        var department_ZH_CN = burnrate.getDepartment_ZH_CN(department);
        var color = colors[department];
        var title_vp = burnrate.title.vp;
        var title_engineer = burnrate.title.Engineer;
        var title_outsource = burnrate.title.Contractor;
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
                $employeeCard.find(".card").removeClass(color).addClass(colors['contractor']);
            }
            $(document.body).append($employeeCard);
        });
    });
});

