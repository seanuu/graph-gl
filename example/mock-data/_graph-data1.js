export default {
    'nodes': [
        {'id': 'Myriel', 'group': 'accountant'},
        {'id': 'Napoleon', 'group': 'accountant'},
        {'id': 'Mlle.Baptistine', 'group': 'accountant'},
        {'id': 'Mme.Magloire', 'group': 'accountant'},
        {'id': 'CountessdeLo', 'group': 'accountant'},
        {'id': 'Geborand', 'group': 'accountant'},
        {'id': 'Champtercier', 'group': 'accountant'},
        {'id': 'Cravatte', 'group': 'accountant'},
        {'id': 'Count', 'group': 'accountant'},
        {'id': 'OldMan', 'group': 'accountant'},
        {'id': 'Labarre', 'group': 'anchor'},
        {'id': 'Valjean', 'group': 'anchor'},
        {'id': 'Marguerite', 'group': 'artist'},
        {'id': 'Mme.deR', 'group': 'anchor'},
        {'id': 'Isabeau', 'group': 'anchor'},
        {'id': 'Gervais', 'group': 'anchor'},
        {'id': 'Tholomyes', 'group': 'artist'},
        {'id': 'Listolier', 'group': 'artist'},
        {'id': 'Fameuil', 'group': 'artist'},
        {'id': 'Blacheville', 'group': 'artist'},
        {'id': 'Favourite', 'group': 'artist'},
        {'id': 'Dahlia', 'group': 'artist'},
        {'id': 'Zephine', 'group': 'artist'},
        {'id': 'Fantine', 'group': 'artist'},
        {'id': 'Mme.Thenardier', 'group': 'attendant'},
        {'id': 'Thenardier', 'group': 'attendant'},
        {'id': 'Cosette', 'group': 'baker'},
        {'id': 'Javert', 'group': 'attendant'},
        {'id': 'Fauchelevent', 'group': 'mechanic'},
        {'id': 'Bamatabois', 'group': 'anchor'},
        {'id': 'Perpetue', 'group': 'artist'},
        {'id': 'Simplice', 'group': 'anchor'},
        {'id': 'Scaufflaire', 'group': 'anchor'},
        {'id': 'Woman1', 'group': 'anchor'},
        {'id': 'Judge', 'group': 'anchor'},
        {'id': 'Champmathieu', 'group': 'anchor'},
        {'id': 'Brevet', 'group': 'anchor'},
        {'id': 'Chenildieu', 'group': 'anchor'},
        {'id': 'Cochepaille', 'group': 'anchor'},
        {'id': 'Pontmercy', 'group': 'attendant'},
        {'id': 'Boulatruelle', 'group': 'barber'},
        {'id': 'Eponine', 'group': 'attendant'},
        {'id': 'Anzelma', 'group': 'attendant'},
        {'id': 'Woman2', 'group': 'baker'},
        {'id': 'MotherInnocent', 'group': 'mechanic'},
        {'id': 'Gribier', 'group': 'mechanic'},
        {'id': 'Jondrette', 'group': 'nurse'},
        {'id': 'Mme.Burgon', 'group': 'nurse'},
        {'id': 'Gavroche', 'group': 'doctor'},
        {'id': 'Gillenormand', 'group': 'baker'},
        {'id': 'Magnon', 'group': 'baker'},
        {'id': 'Mlle.Gillenormand', 'group': 'baker'},
        {'id': 'Mme.Pontmercy', 'group': 'baker'},
        {'id': 'Mlle.Vaubois', 'group': 'baker'},
        {'id': 'Lt.Gillenormand', 'group': 'baker'},
        {'id': 'Marius', 'group': 'doctor'},
        {'id': 'BaronessT', 'group': 'baker'},
        {'id': 'Mabeuf', 'group': 'doctor'},
        {'id': 'Enjolras', 'group': 'doctor'},
        {'id': 'Combeferre', 'group': 'doctor'},
        {'id': 'Prouvaire', 'group': 'doctor'},
        {'id': 'Feuilly', 'group': 'doctor'},
        {'id': 'Courfeyrac', 'group': 'doctor'},
        {'id': 'Bahorel', 'group': 'doctor'},
        {'id': 'Bossuet', 'group': 'doctor'},
        {'id': 'Joly', 'group': 'doctor'},
        {'id': 'Grantaire', 'group': 'doctor'},
        {'id': 'MotherPlutarch', 'group': 'farmer'},
        {'id': 'Gueulemer', 'group': 'attendant'},
        {'id': 'Babet', 'group': 'attendant'},
        {'id': 'Claquesous', 'group': 'attendant'},
        {'id': 'Montparnasse', 'group': 'attendant'},
        {'id': 'Toussaint', 'group': 'baker'},
        {'id': 'Child1', 'group': 'police'},
        {'id': 'Child2', 'group': 'police'},
        {'id': 'Brujon', 'group': 'attendant'},
        {'id': 'Mme.Hucheloup', 'group': 'doctor'}
    ],
    'links': [
        {'source': 'Napoleon', 'target': 'Myriel', 'value': '表姑'},
        {'source': 'Myriel', 'target': 'Napoleon', 'value': '侄女'},
        {'source': 'Mlle.Baptistine', 'target': 'Myriel', 'value': '表姑'},
        {'source': 'Mme.Magloire', 'target': 'Myriel', 'value': '表姑'},
        {'source': 'Mme.Magloire', 'target': 'Mlle.Baptistine', 'value': '表姑'},
        {'source': 'CountessdeLo', 'target': 'Myriel', 'value': '表姑'},
        {'source': 'Geborand', 'target': 'Myriel', 'value': '表姑'},
        {'source': 'Champtercier', 'target': 'Myriel', 'value': '表姑'},
        {'source': 'Cravatte', 'target': 'Myriel', 'value': '表姑'},
        {'source': 'Count', 'target': 'Myriel', 'value': '表姑'},
        {'source': 'OldMan', 'target': 'Myriel', 'value': '表姑'},
        {'source': 'Valjean', 'target': 'Labarre', 'value': '表叔'},
        {'source': 'Valjean', 'target': 'Mme.Magloire', 'value': '表叔'},
        {'source': 'Valjean', 'target': 'Mlle.Baptistine', 'value': '表叔'},
        {'source': 'Valjean', 'target': 'Myriel', 'value': '表叔'},
        {'source': 'Marguerite', 'target': 'Valjean', 'value': '表叔'},
        {'source': 'Mme.deR', 'target': 'Valjean', 'value': '表叔'},
        {'source': 'Isabeau', 'target': 'Valjean', 'value': '表叔'},
        {'source': 'Gervais', 'target': 'Valjean', 'value': '表叔'},
        {'source': 'Listolier', 'target': 'Tholomyes', 'value': '表叔'},
        {'source': 'Fameuil', 'target': 'Tholomyes', 'value': '兄弟'},
        {'source': 'Fameuil', 'target': 'Listolier', 'value': '兄弟'},
        {'source': 'Blacheville', 'target': 'Tholomyes', 'value': '兄弟'},
        {'source': 'Blacheville', 'target': 'Listolier', 'value': '兄弟'},
        {'source': 'Blacheville', 'target': 'Fameuil', 'value': '兄弟'},
        {'source': 'Favourite', 'target': 'Tholomyes', 'value': '兄弟'},
        {'source': 'Favourite', 'target': 'Listolier', 'value': '兄弟'},
        {'source': 'Favourite', 'target': 'Fameuil', 'value': '兄弟'},
        {'source': 'Favourite', 'target': 'Blacheville', 'value': '兄弟'},
        {'source': 'Dahlia', 'target': 'Tholomyes', 'value': '表侄'},
        {'source': 'Dahlia', 'target': 'Listolier', 'value': '表侄'},
        {'source': 'Dahlia', 'target': 'Fameuil', 'value': '表侄'},
        {'source': 'Dahlia', 'target': 'Blacheville', 'value': '表侄'},
        {'source': 'Dahlia', 'target': 'Favourite', 'value': '表侄'},
        {'source': 'Zephine', 'target': 'Tholomyes', 'value': '表侄'},
        {'source': 'Zephine', 'target': 'Listolier', 'value': '表侄'},
        {'source': 'Zephine', 'target': 'Fameuil', 'value': '表侄'},
        {'source': 'Zephine', 'target': 'Blacheville', 'value': '表侄'},
        {'source': 'Zephine', 'target': 'Favourite', 'value': '表侄'},
        {'source': 'Zephine', 'target': 'Dahlia', 'value': '表姊妹'},
        {'source': 'Fantine', 'target': 'Tholomyes', 'value': '表姊妹'},
        {'source': 'Fantine', 'target': 'Listolier', 'value': '表姊妹'},
        {'source': 'Fantine', 'target': 'Fameuil', 'value': '表姊妹'},
        {'source': 'Fantine', 'target': 'Blacheville', 'value': '表姊妹'},
        {'source': 'Fantine', 'target': 'Favourite', 'value': '表姊妹'},
        {'source': 'Fantine', 'target': 'Dahlia', 'value': '表姊妹'},
        {'source': 'Fantine', 'target': 'Zephine', 'value': '表姊妹'},
        {'source': 'Fantine', 'target': 'Marguerite', 'value': '表姊妹'},
        {'source': 'Fantine', 'target': 'Valjean', 'value': '伯父'},
        {'source': 'Mme.Thenardier', 'target': 'Fantine', 'value': '伯父'},
        {'source': 'Mme.Thenardier', 'target': 'Valjean', 'value': '伯父'},
        {'source': 'Thenardier', 'target': 'Mme.Thenardier', 'value': '伯父'},
        {'source': 'Thenardier', 'target': 'Fantine', 'value': '伯父'},
        {'source': 'Thenardier', 'target': 'Valjean', 'value': '伯父'},
        {'source': 'Cosette', 'target': 'Mme.Thenardier', 'value': '伯父'},
        {'source': 'Cosette', 'target': 'Valjean', 'value': '伯父'},
        {'source': 'Cosette', 'target': 'Tholomyes', 'value': '伯父'},
        {'source': 'Cosette', 'target': 'Thenardier', 'value': '伯父'},
        {'source': 'Javert', 'target': 'Valjean', 'value': '伯父'},
        {'source': 'Javert', 'target': 'Fantine', 'value': '伯父'},
        {'source': 'Javert', 'target': 'Thenardier', 'value': '伯父'},
        {'source': 'Javert', 'target': 'Mme.Thenardier', 'value': '大娘'},
        {'source': 'Javert', 'target': 'Cosette', 'value': '大娘'},
        {'source': 'Fauchelevent', 'target': 'Valjean', 'value': '大娘'},
        {'source': 'Fauchelevent', 'target': 'Javert', 'value': '大娘'},
        {'source': 'Bamatabois', 'target': 'Fantine', 'value': '大娘'},
        {'source': 'Bamatabois', 'target': 'Javert', 'value': '大娘'},
        {'source': 'Bamatabois', 'target': 'Valjean', 'value': '大娘'},
        {'source': 'Perpetue', 'target': 'Fantine', 'value': '大娘'},
        {'source': 'Simplice', 'target': 'Perpetue', 'value': '大娘'},
        {'source': 'Simplice', 'target': 'Valjean', 'value': '大娘'},
        {'source': 'Simplice', 'target': 'Fantine', 'value': '大娘'},
        {'source': 'Simplice', 'target': 'Javert', 'value': '大娘'},
        {'source': 'Scaufflaire', 'target': 'Valjean', 'value': '大娘'},
        {'source': 'Woman1', 'target': 'Valjean', 'value': '祖父'},
        {'source': 'Woman1', 'target': 'Javert', 'value': '祖父'},
        {'source': 'Judge', 'target': 'Valjean', 'value': '祖父'},
        {'source': 'Judge', 'target': 'Bamatabois', 'value': '祖父'},
        {'source': 'Champmathieu', 'target': 'Valjean', 'value': '祖父'},
        {'source': 'Champmathieu', 'target': 'Judge', 'value': '祖父'},
        {'source': 'Champmathieu', 'target': 'Bamatabois', 'value': '祖父'},
        {'source': 'Brevet', 'target': 'Judge', 'value': '祖父'},
        {'source': 'Brevet', 'target': 'Champmathieu', 'value': '祖父'},
        {'source': 'Brevet', 'target': 'Valjean', 'value': '祖父'},
        {'source': 'Brevet', 'target': 'Bamatabois', 'value': '祖父'},
        {'source': 'Chenildieu', 'target': 'Judge', 'value': '祖父'},
        {'source': 'Chenildieu', 'target': 'Champmathieu', 'value': '祖父'},
        {'source': 'Chenildieu', 'target': 'Brevet', 'value': '长兄'},
        {'source': 'Chenildieu', 'target': 'Valjean', 'value': '长兄'},
        {'source': 'Chenildieu', 'target': 'Bamatabois', 'value': '长兄'},
        {'source': 'Cochepaille', 'target': 'Judge', 'value': '长兄'},
        {'source': 'Cochepaille', 'target': 'Champmathieu', 'value': '长兄'},
        {'source': 'Cochepaille', 'target': 'Brevet', 'value': '长兄'},
        {'source': 'Cochepaille', 'target': 'Chenildieu', 'value': '长兄'},
        {'source': 'Cochepaille', 'target': 'Valjean', 'value': '长兄'},
        {'source': 'Cochepaille', 'target': 'Bamatabois', 'value': '长兄'},
        {'source': 'Pontmercy', 'target': 'Thenardier', 'value': 'Myriel'},
        {'source': 'Boulatruelle', 'target': 'Thenardier', 'value': 'Myriel'},
        {'source': 'Eponine', 'target': 'Mme.Thenardier', 'value': 'Myriel'},
        {'source': 'Eponine', 'target': 'Thenardier', 'value': 'Myriel'},
        {'source': 'Anzelma', 'target': 'Eponine', 'value': 'Myriel'},
        {'source': 'Anzelma', 'target': 'Thenardier', 'value': 'Myriel'},
        {'source': 'Anzelma', 'target': 'Mme.Thenardier', 'value': 'Myriel'},
        {'source': 'Woman2', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Woman2', 'target': 'Cosette', 'value': 'Myriel'},
        {'source': 'Woman2', 'target': 'Javert', 'value': 'Myriel'},
        {'source': 'MotherInnocent', 'target': 'Fauchelevent', 'value': 'Myriel'},
        {'source': 'MotherInnocent', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Gribier', 'target': 'Fauchelevent', 'value': 'Myriel'},
        {'source': 'Mme.Burgon', 'target': 'Jondrette', 'value': 'Myriel'},
        {'source': 'Gavroche', 'target': 'Mme.Burgon', 'value': 'Myriel'},
        {'source': 'Gavroche', 'target': 'Thenardier', 'value': 'Myriel'},
        {'source': 'Gavroche', 'target': 'Javert', 'value': 'Myriel'},
        {'source': 'Gavroche', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Gillenormand', 'target': 'Cosette', 'value': 'Myriel'},
        {'source': 'Gillenormand', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Magnon', 'target': 'Gillenormand', 'value': 'Myriel'},
        {'source': 'Magnon', 'target': 'Mme.Thenardier', 'value': 'Myriel'},
        {'source': 'Mlle.Gillenormand', 'target': 'Gillenormand', 'value': 'Myriel'},
        {'source': 'Mlle.Gillenormand', 'target': 'Cosette', 'value': 'Myriel'},
        {'source': 'Mlle.Gillenormand', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Mme.Pontmercy', 'target': 'Mlle.Gillenormand', 'value': 'Myriel'},
        {'source': 'Mme.Pontmercy', 'target': 'Pontmercy', 'value': 'Myriel'},
        {'source': 'Mlle.Vaubois', 'target': 'Mlle.Gillenormand', 'value': 'Myriel'},
        {'source': 'Lt.Gillenormand', 'target': 'Mlle.Gillenormand', 'value': 'Myriel'},
        {'source': 'Lt.Gillenormand', 'target': 'Gillenormand', 'value': 'Myriel'},
        {'source': 'Lt.Gillenormand', 'target': 'Cosette', 'value': 'Myriel'},
        {'source': 'Marius', 'target': 'Mlle.Gillenormand', 'value': 'Myriel'},
        {'source': 'Marius', 'target': 'Gillenormand', 'value': 'Myriel'},
        {'source': 'Marius', 'target': 'Pontmercy', 'value': 'Myriel'},
        {'source': 'Marius', 'target': 'Lt.Gillenormand', 'value': 'Myriel'},
        {'source': 'Marius', 'target': 'Cosette', 'value': 'Myriel'},
        {'source': 'Marius', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Marius', 'target': 'Tholomyes', 'value': 'Myriel'},
        {'source': 'Marius', 'target': 'Thenardier', 'value': 'Myriel'},
        {'source': 'Marius', 'target': 'Eponine', 'value': 'Myriel'},
        {'source': 'Marius', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'BaronessT', 'target': 'Gillenormand', 'value': 'Myriel'},
        {'source': 'BaronessT', 'target': 'Marius', 'value': 'Myriel'},
        {'source': 'Mabeuf', 'target': 'Marius', 'value': 'Myriel'},
        {'source': 'Mabeuf', 'target': 'Eponine', 'value': 'Myriel'},
        {'source': 'Mabeuf', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Enjolras', 'target': 'Marius', 'value': 'Myriel'},
        {'source': 'Enjolras', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Enjolras', 'target': 'Javert', 'value': 'Myriel'},
        {'source': 'Enjolras', 'target': 'Mabeuf', 'value': 'Myriel'},
        {'source': 'Enjolras', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Combeferre', 'target': 'Enjolras', 'value': 'Myriel'},
        {'source': 'Combeferre', 'target': 'Marius', 'value': 'Myriel'},
        {'source': 'Combeferre', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Combeferre', 'target': 'Mabeuf', 'value': 'Myriel'},
        {'source': 'Prouvaire', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Prouvaire', 'target': 'Enjolras', 'value': 'Myriel'},
        {'source': 'Prouvaire', 'target': 'Combeferre', 'value': 'Myriel'},
        {'source': 'Feuilly', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Feuilly', 'target': 'Enjolras', 'value': 'Myriel'},
        {'source': 'Feuilly', 'target': 'Prouvaire', 'value': 'Myriel'},
        {'source': 'Feuilly', 'target': 'Combeferre', 'value': 'Myriel'},
        {'source': 'Feuilly', 'target': 'Mabeuf', 'value': 'Myriel'},
        {'source': 'Feuilly', 'target': 'Marius', 'value': 'Myriel'},
        {'source': 'Courfeyrac', 'target': 'Marius', 'value': 'Myriel'},
        {'source': 'Courfeyrac', 'target': 'Enjolras', 'value': 'Myriel'},
        {'source': 'Courfeyrac', 'target': 'Combeferre', 'value': 'Myriel'},
        {'source': 'Courfeyrac', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Courfeyrac', 'target': 'Mabeuf', 'value': 'Myriel'},
        {'source': 'Courfeyrac', 'target': 'Eponine', 'value': 'Myriel'},
        {'source': 'Courfeyrac', 'target': 'Feuilly', 'value': 'Myriel'},
        {'source': 'Courfeyrac', 'target': 'Prouvaire', 'value': 'Myriel'},
        {'source': 'Bahorel', 'target': 'Combeferre', 'value': 'Myriel'},
        {'source': 'Bahorel', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Bahorel', 'target': 'Courfeyrac', 'value': 'Myriel'},
        {'source': 'Bahorel', 'target': 'Mabeuf', 'value': 'Myriel'},
        {'source': 'Bahorel', 'target': 'Enjolras', 'value': 'Myriel'},
        {'source': 'Bahorel', 'target': 'Feuilly', 'value': 'Myriel'},
        {'source': 'Bahorel', 'target': 'Prouvaire', 'value': 'Myriel'},
        {'source': 'Bahorel', 'target': 'Marius', 'value': 'Myriel'},
        {'source': 'Bossuet', 'target': 'Marius', 'value': 'Myriel'},
        {'source': 'Bossuet', 'target': 'Courfeyrac', 'value': 'Myriel'},
        {'source': 'Bossuet', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Bossuet', 'target': 'Bahorel', 'value': 'Myriel'},
        {'source': 'Bossuet', 'target': 'Enjolras', 'value': 'Myriel'},
        {'source': 'Bossuet', 'target': 'Feuilly', 'value': 'Myriel'},
        {'source': 'Bossuet', 'target': 'Prouvaire', 'value': 'Myriel'},
        {'source': 'Bossuet', 'target': 'Combeferre', 'value': 'Myriel'},
        {'source': 'Bossuet', 'target': 'Mabeuf', 'value': 'Myriel'},
        {'source': 'Bossuet', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Joly', 'target': 'Bahorel', 'value': 'Myriel'},
        {'source': 'Joly', 'target': 'Bossuet', 'value': 'Myriel'},
        {'source': 'Joly', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Joly', 'target': 'Courfeyrac', 'value': 'Myriel'},
        {'source': 'Joly', 'target': 'Enjolras', 'value': 'Myriel'},
        {'source': 'Joly', 'target': 'Feuilly', 'value': 'Myriel'},
        {'source': 'Joly', 'target': 'Prouvaire', 'value': 'Myriel'},
        {'source': 'Joly', 'target': 'Combeferre', 'value': 'Myriel'},
        {'source': 'Joly', 'target': 'Mabeuf', 'value': 'Myriel'},
        {'source': 'Joly', 'target': 'Marius', 'value': 'Myriel'},
        {'source': 'Grantaire', 'target': 'Bossuet', 'value': 'Myriel'},
        {'source': 'Grantaire', 'target': 'Enjolras', 'value': 'Myriel'},
        {'source': 'Grantaire', 'target': 'Combeferre', 'value': 'Myriel'},
        {'source': 'Grantaire', 'target': 'Courfeyrac', 'value': 'Myriel'},
        {'source': 'Grantaire', 'target': 'Joly', 'value': 'Myriel'},
        {'source': 'Grantaire', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Grantaire', 'target': 'Bahorel', 'value': 'Myriel'},
        {'source': 'Grantaire', 'target': 'Feuilly', 'value': 'Myriel'},
        {'source': 'Grantaire', 'target': 'Prouvaire', 'value': 'Myriel'},
        {'source': 'MotherPlutarch', 'target': 'Mabeuf', 'value': 'Myriel'},
        {'source': 'Gueulemer', 'target': 'Thenardier', 'value': 'Myriel'},
        {'source': 'Gueulemer', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Gueulemer', 'target': 'Mme.Thenardier', 'value': 'Myriel'},
        {'source': 'Gueulemer', 'target': 'Javert', 'value': 'Myriel'},
        {'source': 'Gueulemer', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Gueulemer', 'target': 'Eponine', 'value': 'Myriel'},
        {'source': 'Babet', 'target': 'Thenardier', 'value': 'Myriel'},
        {'source': 'Babet', 'target': 'Gueulemer', 'value': 'Myriel'},
        {'source': 'Babet', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Babet', 'target': 'Mme.Thenardier', 'value': 'Myriel'},
        {'source': 'Babet', 'target': 'Javert', 'value': 'Myriel'},
        {'source': 'Babet', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Babet', 'target': 'Eponine', 'value': 'Myriel'},
        {'source': 'Claquesous', 'target': 'Thenardier', 'value': 'Myriel'},
        {'source': 'Claquesous', 'target': 'Babet', 'value': 'Myriel'},
        {'source': 'Claquesous', 'target': 'Gueulemer', 'value': 'Myriel'},
        {'source': 'Claquesous', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Claquesous', 'target': 'Mme.Thenardier', 'value': 'Myriel'},
        {'source': 'Claquesous', 'target': 'Javert', 'value': 'Myriel'},
        {'source': 'Claquesous', 'target': 'Eponine', 'value': 'Myriel'},
        {'source': 'Claquesous', 'target': 'Enjolras', 'value': 'Myriel'},
        {'source': 'Montparnasse', 'target': 'Javert', 'value': 'Myriel'},
        {'source': 'Montparnasse', 'target': 'Babet', 'value': 'Myriel'},
        {'source': 'Montparnasse', 'target': 'Gueulemer', 'value': 'Myriel'},
        {'source': 'Montparnasse', 'target': 'Claquesous', 'value': 'Myriel'},
        {'source': 'Montparnasse', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Montparnasse', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Montparnasse', 'target': 'Eponine', 'value': 'Myriel'},
        {'source': 'Montparnasse', 'target': 'Thenardier', 'value': 'Myriel'},
        {'source': 'Toussaint', 'target': 'Cosette', 'value': 'Myriel'},
        {'source': 'Toussaint', 'target': 'Javert', 'value': 'Myriel'},
        {'source': 'Toussaint', 'target': 'Valjean', 'value': 'Myriel'},
        {'source': 'Child1', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Child2', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Child2', 'target': 'Child1', 'value': 'Myriel'},
        {'source': 'Brujon', 'target': 'Babet', 'value': 'Myriel'},
        {'source': 'Brujon', 'target': 'Gueulemer', 'value': 'Myriel'},
        {'source': 'Brujon', 'target': 'Thenardier', 'value': 'Myriel'},
        {'source': 'Brujon', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Brujon', 'target': 'Eponine', 'value': 'Myriel'},
        {'source': 'Brujon', 'target': 'Claquesous', 'value': 'Myriel'},
        {'source': 'Brujon', 'target': 'Montparnasse', 'value': 'Myriel'},
        {'source': 'Mme.Hucheloup', 'target': 'Bossuet', 'value': 'Myriel'},
        {'source': 'Mme.Hucheloup', 'target': 'Joly', 'value': 'Myriel'},
        {'source': 'Mme.Hucheloup', 'target': 'Grantaire', 'value': 'Myriel'},
        {'source': 'Mme.Hucheloup', 'target': 'Bahorel', 'value': 'Myriel'},
        {'source': 'Mme.Hucheloup', 'target': 'Courfeyrac', 'value': 'Myriel'},
        {'source': 'Mme.Hucheloup', 'target': 'Gavroche', 'value': 'Myriel'},
        {'source': 'Mme.Hucheloup', 'target': 'Enjolras', 'value': 'Myriel'}
    ]
};
