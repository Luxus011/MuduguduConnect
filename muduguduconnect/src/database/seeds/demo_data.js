'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash('password123', 10);

    // ── USERS ──
    await queryInterface.bulkInsert('users', [
      { name: 'Marie Uwimana',    email: 'marie@mc.rw',   password: hash, role: 'worker',   verified: true,  created_at: new Date(), updated_at: new Date() },
      { name: 'Jean Habimana',    email: 'jean@mc.rw',    password: hash, role: 'worker',   verified: true,  created_at: new Date(), updated_at: new Date() },
      { name: 'Alice Mukamana',   email: 'alice@mc.rw',   password: hash, role: 'worker',   verified: true,  created_at: new Date(), updated_at: new Date() },
      { name: 'Pierre Nzeyimana', email: 'pierre@mc.rw',  password: hash, role: 'worker',   verified: true,  created_at: new Date(), updated_at: new Date() },
      { name: 'Grace Ingabire',   email: 'grace@mc.rw',   password: hash, role: 'worker',   verified: false, created_at: new Date(), updated_at: new Date() },
      { name: 'David Mugisha',    email: 'david@mc.rw',   password: hash, role: 'worker',   verified: true,  created_at: new Date(), updated_at: new Date() },
      { name: 'Sophie Umubyeyi',  email: 'sophie@mc.rw',  password: hash, role: 'worker',   verified: true,  created_at: new Date(), updated_at: new Date() },
      { name: 'Paul Ndagijimana', email: 'paul@mc.rw',    password: hash, role: 'worker',   verified: true,  created_at: new Date(), updated_at: new Date() },
      { name: 'Claire Employer',  email: 'claire@mc.rw',  password: hash, role: 'employer', verified: true,  created_at: new Date(), updated_at: new Date() },
    ], {});

    // ── WORKERS ──
    await queryInterface.bulkInsert('workers', [
      { user_id:1, job:'Cleaner',    location:'Kimihurura', availability:'Available Now',       description:'Expert en nettoyage résidentiel et bureaux. 5 ans d\'expérience à Kigali.', skills:'["Nettoyage","Repassage","Organisation"]', rate_per_day:4000, exp_years:5, phone:'0780111001', rating:4.9, review_count:32, trust_score:95, boosted:true,  is_online:true,  created_at:new Date(), updated_at:new Date() },
      { user_id:2, job:'Guard',      location:'Kacyiru',    availability:'Available Now',       description:'Agent de sécurité qualifié, ex-police nationale. Sérieux et ponctuel.', skills:'["Surveillance","Premiers secours","Rapport"]', rate_per_day:6000, exp_years:8, phone:'0780111002', rating:4.7, review_count:18, trust_score:88, boosted:false, is_online:true,  created_at:new Date(), updated_at:new Date() },
      { user_id:3, job:'Babysitter', location:'Remera',     availability:'Available Now',       description:'Baby-sitter diplômée en puériculture. Expérience avec enfants 0-12 ans.', skills:'["Puériculture","Aide scolaire","Cuisine enfants"]', rate_per_day:3500, exp_years:4, phone:'0780111003', rating:4.8, review_count:24, trust_score:91, boosted:true,  is_online:false, created_at:new Date(), updated_at:new Date() },
      { user_id:4, job:'Cook',       location:'Nyamirambo', availability:'Available This Week', description:'Cuisinier professionnel, spécialiste cuisine rwandaise et internationale.', skills:'["Cuisine rwandaise","Cuisine internationale","Pâtisserie"]', rate_per_day:5000, exp_years:6, phone:'0780111004', rating:4.6, review_count:15, trust_score:82, boosted:false, is_online:true,  created_at:new Date(), updated_at:new Date() },
      { user_id:5, job:'Gardener',   location:'Gisozi',     availability:'Available Now',       description:'Jardinier passionné, entretien pelouses, taille haies, potager.', skills:'["Taille","Arrosage","Potager","Fleurs"]', rate_per_day:3000, exp_years:3, phone:'0780111005', rating:4.3, review_count:9,  trust_score:70, boosted:false, is_online:false, created_at:new Date(), updated_at:new Date() },
      { user_id:6, job:'Driver',     location:'Gikondo',    availability:'Booked',             description:'Chauffeur permis B et C, véhicule personnel disponible. Ponctuel et discret.', skills:'["Permis B","Permis C","Anglais","Connaissance Kigali"]', rate_per_day:8000, exp_years:7, phone:'0780111006', rating:4.5, review_count:21, trust_score:85, boosted:false, is_online:true,  created_at:new Date(), updated_at:new Date() },
      { user_id:7, job:'Nurse',      location:'Kibagabaga', availability:'Available Now',       description:'Aide-soignante diplômée, accompagnement personnes âgées et malades.', skills:'["Soins","Médicaments","Rééducation","Empathie"]', rate_per_day:7000, exp_years:5, phone:'0780111007', rating:4.9, review_count:28, trust_score:97, boosted:true,  is_online:true,  created_at:new Date(), updated_at:new Date() },
      { user_id:8, job:'Night guard',location:'Muhima',     availability:'Available This Week', description:'Gardien de nuit expérimenté, vigilant et responsable. Disponible dès 20h.', skills:'["Surveillance nuit","Rondes","Communication"]', rate_per_day:5500, exp_years:4, phone:'0780111008', rating:4.4, review_count:11, trust_score:78, boosted:false, is_online:false, created_at:new Date(), updated_at:new Date() },
    ], {});

    // ── REVIEWS ──
    await queryInterface.bulkInsert('reviews', [
      { worker_id:1, employer_id:9, rating:5, comment:'Marie est exceptionnelle ! Mon appartement n\'a jamais été aussi propre.', created_at:new Date(), updated_at:new Date() },
      { worker_id:1, employer_id:9, rating:5, comment:'Très professionnelle, ponctuelle et efficace. Je recommande vivement.', created_at:new Date(), updated_at:new Date() },
      { worker_id:3, employer_id:9, rating:5, comment:'Alice est merveilleuse avec mes enfants, ils adorent passer du temps avec elle.', created_at:new Date(), updated_at:new Date() },
      { worker_id:7, employer_id:9, rating:5, comment:'Sophie a pris soin de ma mère avec beaucoup de douceur. Très professionnelle.', created_at:new Date(), updated_at:new Date() },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('reviews', null, {});
    await queryInterface.bulkDelete('workers', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
