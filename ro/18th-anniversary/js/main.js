$(function() {
    let list = {};
    // https://rotool.gungho.jp/monster/item.php?item=7005
    // https://rotool.gungho.jp/monster/result.php?mode=4&name=ICE_GHOST_H
    const strageKey = 'ro-18th-anniversary';
    let strage = localStorage.getItem(strageKey);
    strage = JSON.parse(strage) || {};


    $.ajax({
        type: 'get',
        url: '/ro/18th-anniversary/list.json',
        data: {},
        cache : true,
    }).done(function(r, status, xhr) {
        list = r;
        createDeliveryTable(r.delivery);
        createQuestTable(r.quest);
        createSubjugationTable(r.subjugation);
    });

    $(document).on('change', 'input[type="checkbox"]', function() {
        const checked = $(this).prop('checked');
        strage[this.name] = checked;
        localStorage.setItem(strageKey, JSON.stringify(strage));

        checked
            ? $(this).parents('tr').addClass('bg-gray disabled')
            : $(this).parents('tr').removeClass('bg-gray disabled');
        setStoneCount();
    });

    $(document).on('change', 'input[type="number"]', function() {
        if (this.value < 0) this.value = 0;
        strage[this.name] = this.value;
        localStorage.setItem(strageKey, JSON.stringify(strage));
    });

    function createTable(data, theadTr, tbody, fnc) {
        theadTr.empty();
        theadTr.append('<th class="text-center"><i class="far fa-check-square"></i></th>');
        Object.values(data.headers).forEach(function(value) {
            theadTr.append('<th>'+value+'</th>');
        });

        tbody.empty();
        Object.values(data.items).forEach(function(item, idx) {
            const tr = fnc($('<tr>'), item, idx);
            const name = data.prefix + idx;
            const checked = strage[name] ? 'checked' : '';
            tr.prepend(
                '<td class="text-center"><input name="'+name+'" type="checkbox" '+ checked +'></td>',
            );
            if (checked) tr.addClass('bg-gray disabled');
            tbody.append(tr);
        });
    }

    function createDeliveryTable(data) {
        const theadTr = $('#DeliveryTable').find('thead').find('tr');
        const tbody = $('#DeliveryTable').find('tbody');
        createTable(data, theadTr, tbody, function(tr, item, idx) {
            const name = data.prefix + idx + '__preparationCount';
            const preparationCount = strage[name] ? strage[name] : 0;
            tr.append(
                '<td>'
                + item.name + ' <a target="_blank" rel="noopener" href="https://rotool.gungho.jp/monster/item.php?item='+item.itemId+'" class="btn-outline-secondary btn-xs"><i class="fas fa-search"></i></a>'
                + '</td>',
                '<td>'+item.count+'</td>',
                '<td><div class="form-group"><input type="number" name="'+name+'" class="form-control form-control-sm" value="'+preparationCount+'" placeholder="数値"></div></td>',
            );
            return tr;
        });
    }

    function createQuestTable(data) {
        const theadTr = $('#QuestTable').find('thead').find('tr');
        const tbody = $('#QuestTable').find('tbody');
        createTable(data, theadTr, tbody, function(tr, item, idx) {
            const checkIcon = item.skip ? '<i class="fas fa-check"></i> <span class="text-muted">'+item.skip+'個</span>' : '';
            const name = data.prefix + idx;
            tr.append(
                '<td>'+item.name+'</td>',
                '<td>'+checkIcon+'</td>'
            );
            return tr;
        });
        setStoneCount();
    }

    function setStoneCount() {
        let stone = 0;
        let maxStone = 0;
        Object.values(list.quest.items).forEach(function(item, idx) {
            const key = list.quest.prefix + idx;
            stone += (item.skip && strage[key]) ? item.skip : 0;
            maxStone += item.skip ? item.skip : 0;
        });
        const need = maxStone - stone;
        $('.js-skip-count').text(need + ' / ' + maxStone + ' 個');
    }

    function createSubjugationTable(data) {
        const theadTr = $('#SubjugationTable').find('thead').find('tr');
        const tbody = $('#SubjugationTable').find('tbody');
        createTable(data, theadTr, tbody, function(tr, item, idx) {
            tr.append(
                '<td>'+item.name+'</td>',
                '<td>'+item.count+'</td>',
                '<td>'+item.spawn+'</td>'
            );
            return tr;
        });
    }
});
