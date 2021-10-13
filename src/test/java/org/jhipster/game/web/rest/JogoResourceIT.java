package org.jhipster.game.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.jhipster.game.IntegrationTest;
import org.jhipster.game.domain.Jogo;
import org.jhipster.game.repository.JogoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link JogoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class JogoResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_ANO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_ANO = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final Double DEFAULT_PRECO = 1D;
    private static final Double UPDATED_PRECO = 2D;

    private static final String DEFAULT_IMAGE = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE = "BBBBBBBBBB";

    private static final Integer DEFAULT_ESTOQUE = 1;
    private static final Integer UPDATED_ESTOQUE = 2;

    private static final String ENTITY_API_URL = "/api/jogos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JogoRepository jogoRepository;

    @Mock
    private JogoRepository jogoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJogoMockMvc;

    private Jogo jogo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Jogo createEntity(EntityManager em) {
        Jogo jogo = new Jogo()
            .nome(DEFAULT_NOME)
            .ano(DEFAULT_ANO)
            .descricao(DEFAULT_DESCRICAO)
            .preco(DEFAULT_PRECO)
            .image(DEFAULT_IMAGE)
            .estoque(DEFAULT_ESTOQUE);
        return jogo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Jogo createUpdatedEntity(EntityManager em) {
        Jogo jogo = new Jogo()
            .nome(UPDATED_NOME)
            .ano(UPDATED_ANO)
            .descricao(UPDATED_DESCRICAO)
            .preco(UPDATED_PRECO)
            .image(UPDATED_IMAGE)
            .estoque(UPDATED_ESTOQUE);
        return jogo;
    }

    @BeforeEach
    public void initTest() {
        jogo = createEntity(em);
    }

    @Test
    @Transactional
    void createJogo() throws Exception {
        int databaseSizeBeforeCreate = jogoRepository.findAll().size();
        // Create the Jogo
        restJogoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(jogo)))
            .andExpect(status().isCreated());

        // Validate the Jogo in the database
        List<Jogo> jogoList = jogoRepository.findAll();
        assertThat(jogoList).hasSize(databaseSizeBeforeCreate + 1);
        Jogo testJogo = jogoList.get(jogoList.size() - 1);
        assertThat(testJogo.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testJogo.getAno()).isEqualTo(DEFAULT_ANO);
        assertThat(testJogo.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testJogo.getPreco()).isEqualTo(DEFAULT_PRECO);
        assertThat(testJogo.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testJogo.getEstoque()).isEqualTo(DEFAULT_ESTOQUE);
    }

    @Test
    @Transactional
    void createJogoWithExistingId() throws Exception {
        // Create the Jogo with an existing ID
        jogo.setId(1L);

        int databaseSizeBeforeCreate = jogoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJogoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(jogo)))
            .andExpect(status().isBadRequest());

        // Validate the Jogo in the database
        List<Jogo> jogoList = jogoRepository.findAll();
        assertThat(jogoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllJogos() throws Exception {
        // Initialize the database
        jogoRepository.saveAndFlush(jogo);

        // Get all the jogoList
        restJogoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jogo.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].ano").value(hasItem(DEFAULT_ANO.toString())))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)))
            .andExpect(jsonPath("$.[*].preco").value(hasItem(DEFAULT_PRECO.doubleValue())))
            .andExpect(jsonPath("$.[*].image").value(hasItem(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.[*].estoque").value(hasItem(DEFAULT_ESTOQUE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllJogosWithEagerRelationshipsIsEnabled() throws Exception {
        when(jogoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restJogoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(jogoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllJogosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(jogoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restJogoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(jogoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getJogo() throws Exception {
        // Initialize the database
        jogoRepository.saveAndFlush(jogo);

        // Get the jogo
        restJogoMockMvc
            .perform(get(ENTITY_API_URL_ID, jogo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(jogo.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.ano").value(DEFAULT_ANO.toString()))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO))
            .andExpect(jsonPath("$.preco").value(DEFAULT_PRECO.doubleValue()))
            .andExpect(jsonPath("$.image").value(DEFAULT_IMAGE))
            .andExpect(jsonPath("$.estoque").value(DEFAULT_ESTOQUE));
    }

    @Test
    @Transactional
    void getNonExistingJogo() throws Exception {
        // Get the jogo
        restJogoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewJogo() throws Exception {
        // Initialize the database
        jogoRepository.saveAndFlush(jogo);

        int databaseSizeBeforeUpdate = jogoRepository.findAll().size();

        // Update the jogo
        Jogo updatedJogo = jogoRepository.findById(jogo.getId()).get();
        // Disconnect from session so that the updates on updatedJogo are not directly saved in db
        em.detach(updatedJogo);
        updatedJogo
            .nome(UPDATED_NOME)
            .ano(UPDATED_ANO)
            .descricao(UPDATED_DESCRICAO)
            .preco(UPDATED_PRECO)
            .image(UPDATED_IMAGE)
            .estoque(UPDATED_ESTOQUE);

        restJogoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJogo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJogo))
            )
            .andExpect(status().isOk());

        // Validate the Jogo in the database
        List<Jogo> jogoList = jogoRepository.findAll();
        assertThat(jogoList).hasSize(databaseSizeBeforeUpdate);
        Jogo testJogo = jogoList.get(jogoList.size() - 1);
        assertThat(testJogo.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testJogo.getAno()).isEqualTo(UPDATED_ANO);
        assertThat(testJogo.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testJogo.getPreco()).isEqualTo(UPDATED_PRECO);
        assertThat(testJogo.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testJogo.getEstoque()).isEqualTo(UPDATED_ESTOQUE);
    }

    @Test
    @Transactional
    void putNonExistingJogo() throws Exception {
        int databaseSizeBeforeUpdate = jogoRepository.findAll().size();
        jogo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJogoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, jogo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jogo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jogo in the database
        List<Jogo> jogoList = jogoRepository.findAll();
        assertThat(jogoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJogo() throws Exception {
        int databaseSizeBeforeUpdate = jogoRepository.findAll().size();
        jogo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJogoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jogo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jogo in the database
        List<Jogo> jogoList = jogoRepository.findAll();
        assertThat(jogoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJogo() throws Exception {
        int databaseSizeBeforeUpdate = jogoRepository.findAll().size();
        jogo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJogoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(jogo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Jogo in the database
        List<Jogo> jogoList = jogoRepository.findAll();
        assertThat(jogoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJogoWithPatch() throws Exception {
        // Initialize the database
        jogoRepository.saveAndFlush(jogo);

        int databaseSizeBeforeUpdate = jogoRepository.findAll().size();

        // Update the jogo using partial update
        Jogo partialUpdatedJogo = new Jogo();
        partialUpdatedJogo.setId(jogo.getId());

        partialUpdatedJogo.nome(UPDATED_NOME).preco(UPDATED_PRECO).image(UPDATED_IMAGE);

        restJogoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJogo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJogo))
            )
            .andExpect(status().isOk());

        // Validate the Jogo in the database
        List<Jogo> jogoList = jogoRepository.findAll();
        assertThat(jogoList).hasSize(databaseSizeBeforeUpdate);
        Jogo testJogo = jogoList.get(jogoList.size() - 1);
        assertThat(testJogo.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testJogo.getAno()).isEqualTo(DEFAULT_ANO);
        assertThat(testJogo.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testJogo.getPreco()).isEqualTo(UPDATED_PRECO);
        assertThat(testJogo.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testJogo.getEstoque()).isEqualTo(DEFAULT_ESTOQUE);
    }

    @Test
    @Transactional
    void fullUpdateJogoWithPatch() throws Exception {
        // Initialize the database
        jogoRepository.saveAndFlush(jogo);

        int databaseSizeBeforeUpdate = jogoRepository.findAll().size();

        // Update the jogo using partial update
        Jogo partialUpdatedJogo = new Jogo();
        partialUpdatedJogo.setId(jogo.getId());

        partialUpdatedJogo
            .nome(UPDATED_NOME)
            .ano(UPDATED_ANO)
            .descricao(UPDATED_DESCRICAO)
            .preco(UPDATED_PRECO)
            .image(UPDATED_IMAGE)
            .estoque(UPDATED_ESTOQUE);

        restJogoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJogo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJogo))
            )
            .andExpect(status().isOk());

        // Validate the Jogo in the database
        List<Jogo> jogoList = jogoRepository.findAll();
        assertThat(jogoList).hasSize(databaseSizeBeforeUpdate);
        Jogo testJogo = jogoList.get(jogoList.size() - 1);
        assertThat(testJogo.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testJogo.getAno()).isEqualTo(UPDATED_ANO);
        assertThat(testJogo.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testJogo.getPreco()).isEqualTo(UPDATED_PRECO);
        assertThat(testJogo.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testJogo.getEstoque()).isEqualTo(UPDATED_ESTOQUE);
    }

    @Test
    @Transactional
    void patchNonExistingJogo() throws Exception {
        int databaseSizeBeforeUpdate = jogoRepository.findAll().size();
        jogo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJogoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, jogo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jogo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jogo in the database
        List<Jogo> jogoList = jogoRepository.findAll();
        assertThat(jogoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJogo() throws Exception {
        int databaseSizeBeforeUpdate = jogoRepository.findAll().size();
        jogo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJogoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jogo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jogo in the database
        List<Jogo> jogoList = jogoRepository.findAll();
        assertThat(jogoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJogo() throws Exception {
        int databaseSizeBeforeUpdate = jogoRepository.findAll().size();
        jogo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJogoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(jogo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Jogo in the database
        List<Jogo> jogoList = jogoRepository.findAll();
        assertThat(jogoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJogo() throws Exception {
        // Initialize the database
        jogoRepository.saveAndFlush(jogo);

        int databaseSizeBeforeDelete = jogoRepository.findAll().size();

        // Delete the jogo
        restJogoMockMvc
            .perform(delete(ENTITY_API_URL_ID, jogo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Jogo> jogoList = jogoRepository.findAll();
        assertThat(jogoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
